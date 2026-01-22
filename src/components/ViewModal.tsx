import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Progress } from "./ui/progress"
import { formatConfidence } from "../lib/utils"
import { PaperAnalysis } from "../types"

export function ViewModal({
  analysis,
  onClose,
}: {
  analysis: PaperAnalysis | null
  onClose: () => void
}) {
  if (!analysis) return null;

  return (
    <Dialog open={!!analysis} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{analysis.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">

          <div>
            <p className="font-medium">Type</p>
            <p>{analysis.type}</p>
            <Progress value={analysis.typeConfidence * 100} />
            <p>{formatConfidence(analysis.typeConfidence)}</p>
          </div>

          <div>
            <p className="font-medium">Nature</p>
            <p>{analysis.nature}</p>
            <Progress value={analysis.natureConfidence * 100} />
            <p>{formatConfidence(analysis.natureConfidence)}</p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
