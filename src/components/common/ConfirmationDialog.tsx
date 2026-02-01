import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  actionFunction: () => void | Promise<void>;
  /** Custom trigger node (icon, text, button, etc.) */
  trigger?: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  triggerText?: string;
};

export default function ConfirmationDialog({
  title,
  description,
  actionFunction,
  trigger,
  variant = "outline",
  triggerText = "Show Dialog",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ? (
          // Use custom trigger node
          <Button variant={variant}>{trigger}</Button>
        ) : (
          // Use default button
          <Button variant={variant}>{triggerText}</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => actionFunction()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
