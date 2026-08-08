import { MediaManager } from "@/components/admin/media-manager";

export const dynamic = "force-dynamic";

export default function AdminMediaPage() {
  return <MediaManager cloudinaryConfigured={Boolean(process.env.CLOUDINARY_CLOUD_NAME)} />;
}
