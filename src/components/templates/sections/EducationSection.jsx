import { TimelineList } from "./ExperienceSection";

export default function EducationSection({ data = {} }) {
  return <TimelineList title="Education" items={data.items || []} />;
}
