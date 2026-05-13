import Link from 'next/link'
import TechStackTag from './TechStackTag'
import RoleTag from './RoleTag'

function ProjectCard({ project }) {
    const {id, title, description, owner_data, tech_stack_list, roles_list, created_at} = project;

    const truncate = (str, len) => str.length > len ? str.slice(0, len) + '...' : str;
    
    return (
        <div className='border shadow-2xl hover:bg-amber-300'>
            <h1><Link href={`/projects/${id}`}>{title}</Link></h1>

            <p>by <Link href={`/profile/${owner_data.username}`}>{owner_data.username}</Link></p>

            <p>{truncate(description, 100)}</p>

            <div className='flex gap-2'>
                {tech_stack_list.includes('javascript') &&
                tech_stack_list.map((tech) => (
                    <TechStackTag key={tech} techStack={tech} />
                ))
                }

                {roles_list.length > 0 &&
                roles_list.map((role) => (
                    <RoleTag key={role} role={role} />
                ))
                }
            </div>

            <footer className='text-sm'>
                {new Date(created_at).toLocaleDateString()}
            </footer>
        </div>
    );
}

export default ProjectCard;