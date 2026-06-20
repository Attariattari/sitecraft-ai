import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Layout, Zap, Shield } from "lucide-react";

export default function Home() {
    return ( <
        div className = "flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20" > { /* Header */ } <
        header className = "fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-300" >
        <
        div className = "container mx-auto px-6 h-16 flex items-center justify-between" >
        <
        div className = "flex items-center gap-2" >
        <
        div className = "size-8 bg-primary rounded-lg flex items-center justify-center" >
        <
        Sparkles className = "size-5 text-white" / >
        <
        /div> <
        span className = "text-xl font-bold tracking-tight text-foreground" >
        SiteCraft < span className = "text-primary" > AI < /span> <
        /span> <
        /div> <
        nav className = "hidden md:flex items-center gap-8 text-sm font-medium text-secondary-foreground" >
        <
        a href = "#"
        className = "hover:text-primary transition-colors" >
        Features <
        /a> <
        a href = "#"
        className = "hover:text-primary transition-colors" >
        Templates <
        /a> <
        a href = "#"
        className = "hover:text-primary transition-colors" >
        Pricing <
        /a> <
        /nav> <
        div className = "flex items-center gap-4" >
        <
        Button variant = "ghost"
        size = "sm" >
        Log in
        <
        /Button> <
        Button size = "sm"
        className = "hidden sm:flex" >
        Get Started <
        /Button> <
        /div> <
        /div> <
        /header>

        <
        main className = "flex-1 pt-16" > { /* Hero Section */ } <
        section className = "relative py-20 lg:py-32 overflow-hidden bg-soft" >
        <
        div className = "container mx-auto px-6 relative z-10" >
        <
        div className = "max-w-4xl mx-auto text-center" >
        <
        div className = "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 animate-fade-in" >
        <
        Sparkles className = "size-3" / >
        <
        span > Next - Gen AI Website Builder < /span> <
        /div> <
        h1 className = "text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-8 text-balance" >
        Build a professional website in { " " } <
        span className = "text-primary" > seconds < /span> not weeks <
        /h1> <
        p className = "text-xl text-secondary-foreground mb-12 max-w-2xl mx-auto leading-relaxed" >
        SiteCraft AI combines the power of generative design with a professional - grade editor.Effortlessly launch premium,
        high - converting websites. <
        /p> <
        div className = "flex flex-col sm:flex-row items-center justify-center gap-4" >
        <
        Button size = "lg"
        className = "h-14 px-8 text-lg font-semibold w-full sm:w-auto" >
        Start Building Free < ArrowRight className = "ml-2 size-5" / >
        <
        /Button> <
        Button variant = "outline"
        size = "lg"
        className = "h-14 px-8 text-lg font-semibold w-full sm:w-auto" >
        View Templates <
        /Button> <
        /div> <
        /div> <
        /div>

        { /* Subtle decoration */ } <
        div className = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10" >
        <
        div className = "absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" / >
        <
        div className = "absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" / >
        <
        /div> <
        /section>

        { /* Features Grid */ } <
        section className = "py-24 bg-white" >
        <
        div className = "container mx-auto px-6" >
        <
        div className = "grid grid-cols-1 md:grid-cols-3 gap-12" >
        <
        div className = "flex flex-col items-start gap-4 p-6 rounded-2xl bg-soft border border-border group hover:border-primary/30 transition-all shadow-sm hover:shadow-md" >
        <
        div className = "size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform" >
        <
        Zap className = "size-6" / >
        <
        /div> <
        h3 className = "text-xl font-bold" > Lightning Fast < /h3> <
        p className = "text-secondary-foreground leading-relaxed" >
        Generate complete landing pages with copy and optimized images in under 30 seconds. <
        /p> <
        /div> <
        div className = "flex flex-col items-start gap-4 p-6 rounded-2xl bg-soft border border-border group hover:border-primary/30 transition-all shadow-sm hover:shadow-md" >
        <
        div className = "size-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform" >
        <
        Layout className = "size-6" / >
        <
        /div> <
        h3 className = "text-xl font-bold" > Pixel Perfect < /h3> <
        p className = "text-secondary-foreground leading-relaxed" >
        Clean, responsive layouts that follow modern SaaS design principles out of the box. <
        /p> <
        /div> <
        div className = "flex flex-col items-start gap-4 p-6 rounded-2xl bg-soft border border-border group hover:border-primary/30 transition-all shadow-sm hover:shadow-md" >
        <
        div className = "size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform" >
        <
        Shield className = "size-6" / >
        <
        /div> <
        h3 className = "text-xl font-bold" > Enterprise Ready < /h3> <
        p className = "text-secondary-foreground leading-relaxed" >
        Built with performance, SEO, and security in mind.Hosted on global edge networks. <
        /p> <
        /div> <
        /div> <
        /div> <
        /section>

        { /* CTA Section with Accent */ } <
        section className = "py-24" >
        <
        div className = "container mx-auto px-6" >
        <
        div className = "bg-foreground text-background rounded-3xl p-12 lg:p-20 relative overflow-hidden flex flex-col items-center text-center" >
        <
        div className = "absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" / >
        <
        h2 className = "text-4xl lg:text-5xl font-bold mb-6 relative z-10" >
        Ready to transform your online presence ?
        <
        /h2> <
        p className = "text-lg text-secondary mb-10 max-w-xl relative z-10 opacity-80" >
        Join 10, 000 + creators building the future of the web with SiteCraft AI. <
        /p> <
        div className = "relative z-10" >
        <
        Button variant = "accent"
        size = "lg"
        className = "h-14 px-10 text-lg font-bold" >
        Get Started
        for Free <
        /Button> <
        /div> <
        /div> <
        /div> <
        /section> <
        /main>

        <
        footer className = "bg-white border-t border-border py-12" >
        <
        div className = "container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8" >
        <
        div className = "flex items-center gap-2" >
        <
        div className = "size-6 bg-primary rounded flex items-center justify-center" >
        <
        Sparkles className = "size-3.5 text-white" / >
        <
        /div> <
        span className = "font-bold tracking-tight text-foreground" >
        SiteCraft AI <
        /span> <
        /div> <
        p className = "text-secondary-foreground text-sm" > ©2026 SiteCraft AI.All rights reserved. <
        /p> <
        div className = "flex gap-6 text-sm text-secondary-foreground" >
        <
        a href = "#"
        className = "hover:text-primary transition-colors" >
        Twitter <
        /a> <
        a href = "#"
        className = "hover:text-primary transition-colors" >
        Discord <
        /a> <
        a href = "#"
        className = "hover:text-primary transition-colors" >
        Terms <
        /a> <
        /div> <
        /div> <
        /footer> <
        /div>
    );
}