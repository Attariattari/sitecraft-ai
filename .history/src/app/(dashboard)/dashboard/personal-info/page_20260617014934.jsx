"use client";

import React, { useState, useEffect } from "react";
import { siteCraftPersonalInfoCategories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Briefcase,
  Scissors,
  ShoppingBag,
  Utensils,
  HeartPulse,
  Building,
  Rocket,
  GraduationCap,
  Target,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Layout,
} from "lucide-react";

export default function PersonalInfoPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sitecraft_personal_info");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.categoryId) {
          setSelectedCategoryId(parsed.categoryId);
          setFormData(parsed.data || {});
        }
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const selectedCategory = siteCraftPersonalInfoCategories.find(
    (c) => c.id === selectedCategoryId,
  );

  // Auto-init form structure when category changes
  useEffect(() => {
    if (isLoaded && selectedCategory && !formData[selectedCategoryId]) {
      const initData = { ...formData };
      const catData = {};
      selectedCategory.sections.forEach((sec) => {
        if (sec.type === "repeater") {
          catData[sec.sectionId] = [];
        } else {
          catData[sec.sectionId] = {};
        }
      });
      initData[selectedCategoryId] = catData;
      setFormData(initData);
    }
  }, [selectedCategoryId, isLoaded, selectedCategory]);

  const handleSave = () => {
    try {
      localStorage.setItem(
        "sitecraft_personal_info",
        JSON.stringify({
          categoryId: selectedCategoryId,
          data: formData,
        }),
      );
      setToast({
        type: "success",
        message: "Personal Info saved successfully!",
      });
    } catch {
      setToast({ type: "error", message: "Failed to save info" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const currentData = formData[selectedCategoryId] || {};

  const handleFieldChange = (sectionId, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [selectedCategoryId]: {
        ...prev[selectedCategoryId],
        [sectionId]: {
          ...prev[selectedCategoryId]?.[sectionId],
          [fieldName]: value,
        },
      },
    }));
  };

  const handleRepeaterChange = (sectionId, index, fieldName, value) => {
    setFormData((prev) => {
      const newArray = [...(prev[selectedCategoryId]?.[sectionId] || [])];
      if (!newArray[index]) newArray[index] = {};
      newArray[index][fieldName] = value;
      return {
        ...prev,
        [selectedCategoryId]: {
          ...prev[selectedCategoryId],
          [sectionId]: newArray,
        },
      };
    });
  };

  const handleAddRepeaterItem = (sectionId) => {
    setFormData((prev) => {
      const newArray = [...(prev[selectedCategoryId]?.[sectionId] || [])];
      newArray.push({});
      return {
        ...prev,
        [selectedCategoryId]: {
          ...prev[selectedCategoryId],
          [sectionId]: newArray,
        },
      };
    });
  };

  const handleRemoveRepeaterItem = (sectionId, index) => {
    setFormData((prev) => {
      const newArray = [...(prev[selectedCategoryId]?.[sectionId] || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [selectedCategoryId]: {
          ...prev[selectedCategoryId],
          [sectionId]: newArray,
        },
      };
    });
  };

  const iconsMap = {
    User,
    Briefcase,
    Scissors,
    ShoppingBag,
    Utensils,
    HeartPulse,
    Building,
    Rocket,
    GraduationCap,
    Target,
  };

  if (!mounted) return null;

  const calculateCompletion = () => {
    if (!selectedCategory) return 0;
    const requiredSections = selectedCategory.sections.filter(
      (s) => s.type !== "repeater",
    );
    let filledSections = 0;
    requiredSections.forEach((sec) => {
      const data = currentData[sec.sectionId] || {};
      if (
        Object.keys(data).some((k) => data[k] !== undefined && data[k] !== "")
      ) {
        filledSections++;
      }
    });
    return Math.round(
      (filledSections / Math.max(requiredSections.length, 1)) * 100,
    );
  };

  const completionScore = calculateCompletion();

  return (
    <div className="max-w-[1200px] mx-auto w-full pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[30px] md:text-[36px] font-bold text-foreground tracking-tight">
            Personal Info
          </h1>
          <p className="text-muted-foreground text-[14px] mt-1">
            Manage the details SiteCraft AI uses to generate your websites.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={!selectedCategory}
            className="site-primary-button px-5 py-2 rounded-lg text-[15px] font-semibold flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
          >
            <Save className="w-4 h-4" />
            Save Personal Info
          </Button>
        </div>
      </div>

      {toast && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4 ${
            toast.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 border border-red-500/20"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {toast.message}
        </div>
      )}

      {/* Category Selector */}
      <div className="mb-10">
        <h2 className="text-[20px] font-semibold mb-4 text-foreground">
          What type of website are you building?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {siteCraftPersonalInfoCategories.map((cat) => {
            const IconComponent = iconsMap[cat.icon] || Layout;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border hover:border-primary/50 hover:bg-muted text-foreground"
                }`}
              >
                <IconComponent
                  className={`w-8 h-8 mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className="text-[14px] font-semibold">{cat.label}</span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCategory && (
        <>
          <div className="bg-card border border-border rounded-xl p-5 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="w-20 h-20 shrink-0 rounded-full border-4 border-primary/20 flex flex-col items-center justify-center relative bg-gradient-to-br from-primary/10 to-transparent">
              <span className="text-xl font-bold text-primary">
                {completionScore}%
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                {selectedCategory.label} Profile Completion
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Complete these details to give AI the best context for your
                website.
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${completionScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {selectedCategory.sections.map((section) => (
              <div
                key={section.sectionId}
                className="bg-card border border-border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-[20px] md:text-[22px] font-bold mb-6 pb-4 border-b border-border text-foreground">
                  {section.title}
                </h3>

                {section.type === "repeater" ? (
                  <div className="space-y-6">
                    {(currentData[section.sectionId] || []).map(
                      (item, index) => (
                        <div
                          key={index}
                          className="p-4 border border-border bg-muted/20 rounded-lg relative"
                        >
                          <button
                            onClick={() =>
                              handleRemoveRepeaterItem(section.sectionId, index)
                            }
                            className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                            {section.fields.map((field) => (
                              <FieldRenderer
                                key={field.name}
                                field={field}
                                value={
                                  item[field.name] ||
                                  (field.type === "switch" ? false : "")
                                }
                                onChange={(val) =>
                                  handleRepeaterChange(
                                    section.sectionId,
                                    index,
                                    field.name,
                                    val,
                                  )
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                    <Button
                      onClick={() => handleAddRepeaterItem(section.sectionId)}
                      variant="outline"
                      className="w-full border-dashed bg-transparent hover:bg-muted text-foreground h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add{" "}
                      {section.title.slice(0, -1)}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map((field) => (
                      <FieldRenderer
                        key={field.name}
                        field={field}
                        value={
                          currentData[section.sectionId]?.[field.name] ||
                          (field.type === "switch" ? false : "")
                        }
                        onChange={(val) =>
                          handleFieldChange(section.sectionId, field.name, val)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSave}
              className="site-primary-button px-8 py-6 rounded-xl text-[16px] font-bold text-white shadow-xl shadow-primary/20"
            >
              Save Personal Info
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function FieldRenderer({ field, value, onChange }) {
  const isFullWidth =
    field.type === "textarea" ||
    field.type === "tags" ||
    field.name.toLowerCase().includes("description");

  return (
    <div
      className={`space-y-2 ${isFullWidth ? "col-span-1 md:col-span-2" : ""}`}
    >
      {field.type !== "switch" && (
        <Label className="text-[14px] text-foreground font-medium">
          {field.label}{" "}
          {field.required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ""}
          className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-[15px] text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] transition-all"
        />
      ) : field.type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-12 w-full rounded-lg border border-border bg-background px-3 py-2 text-[15px] text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          <option value="">Select an option</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === "switch" ? (
        <div className="flex items-center gap-3 pt-6">
          <button
            onClick={() => onChange(!value)}
            className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-primary" : "bg-muted"}`}
            type="button"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
          <Label
            className="text-[14px] cursor-pointer"
            onClick={() => onChange(!value)}
          >
            {field.label}
          </Label>
        </div>
      ) : (
        <Input
          type={
            field.type === "url"
              ? "url"
              : field.type === "email"
                ? "email"
                : field.type === "number"
                  ? "number"
                  : field.type === "time"
                    ? "time"
                    : field.type === "date"
                      ? "date"
                      : "text"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ""}
          className="h-12 border-border text-[15px] bg-background focus-visible:ring-primary rounded-lg transition-all"
        />
      )}

      {field.helperText && (
        <p className="text-[12px] text-muted-foreground">{field.helperText}</p>
      )}
    </div>
  );
}
