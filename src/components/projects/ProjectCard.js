import Link from "next/link";
import TechStackTag from "./TechStackTag";
import RoleTag from "./RoleTag";

function ProjectCard({ project }) {
  const {
    project_id,
    title,
    description,
    owner_data,
    tech_stack_list,
    roles_list,
    created_at,
  } = project;

  const truncate = (str, len) =>
    str.length > len ? str.slice(0, len) + "..." : str;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition-all">
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-gray-900">
          <Link 
            href={`/projects/${project_id}`} 
            className="hover:text-[#378ADD] transition-colors"
          >
            {title}
          </Link>
        </h1>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        by{" "}
        <Link 
          href={`/profile/${owner_data.username}`}
          className="text-gray-700 hover:text-[#378ADD] transition-colors"
        >
          {owner_data.username}
        </Link>
      </p>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {truncate(description, 99)}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tech_stack_list.length > 0 &&
          tech_stack_list.map((tech) => (
            <TechStackTag key={tech} tech={tech} />
          ))}

        {roles_list.length > 0 &&
          roles_list.map((role) => <RoleTag key={role} role={role} />)}
      </div>

      <footer className="text-xs text-gray-500 pt-3 border-t border-gray-100">
        Date Posted: {new Date(created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          // hour: "2-digit",
          // minute: "2-digit",
        })}
      </footer>
    </div>
  );
}

export default ProjectCard;
