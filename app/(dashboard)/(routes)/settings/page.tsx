import { Heading } from "@/components/heading";
import { SubsciptionButton } from "@/components/subscription-button";
import { checkSubcription } from "@/lib/subscription";
import { Settings } from "lucide-react";

const SettingsPage = async () => {
  const isPro = await checkSubcription();
  return (
    <div>
      <Heading
        title="Settings"
        description="Manage Account Settings"
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are Currently on a pro Plan."
            : "You are Currently on a free plan."}
        </div>
        <SubsciptionButton isPro={isPro} />
      </div>
    </div>
  );
};
export default SettingsPage;
