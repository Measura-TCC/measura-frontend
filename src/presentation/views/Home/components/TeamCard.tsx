import { TeamMember } from "../utils/team";
import Image from "next/image";
import {
  GithubIcon,
  LinkedinIcon,
  BookIcon,
} from "@/presentation/assets/icons";

interface TeamCardProps {
  member: TeamMember;
}

export const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  return (
    <div className="bg-background p-6 rounded-2xl shadow-md border border-border text-center transition-colors duration-200">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={member.avatar}
          alt={member.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-violet-100"
          width={80}
          height={80}
        />

        <div>
          <h3 className="text-lg font-semibold text-default mb-1">
            {member.name}
          </h3>
          <p className="text-sm text-violet-600 font-medium mb-2">
            {member.role}
          </p>
          <p className="text-sm text-secondary leading-relaxed">
            {member.shortBio}
          </p>
        </div>

        {member.links && (
          <div className="flex items-center gap-3 mt-2">
            {member.links.github && (
              <a
                href={member.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={`GitHub de ${member.name}`}
              >
                <GithubIcon className="w-4 h-4 text-gray-700" />
              </a>
            )}

            {member.links.linkedin && (
              <a
                href={member.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={`LinkedIn de ${member.name}`}
              >
                <LinkedinIcon className="w-4 h-4 text-blue-700" />
              </a>
            )}

            {member.links.lattes && (
              <a
                href={member.links.lattes}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={`Lattes de ${member.name}`}
              >
                <BookIcon className="w-4 h-4 text-green-700" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
