import Link from "next/link";
import { BlogPost } from "@/types/BlogPost";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-surface rounded-lg border border-line overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center text-sm text-muted mb-3">
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
        </div>
        <h3 className="text-xl font-semibold text-ink mb-3 group-hover:text-accent transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-muted mb-4 line-clamp-2">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 border border-line text-muted text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
