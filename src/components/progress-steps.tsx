import Text from "@/components/text";

type ProgressStepsProps = {
  labels: [string, string, string];
  activeCount: 1 | 2 | 3;
};

export default function ProgressSteps({
  labels,
  activeCount,
}: ProgressStepsProps) {
  return (
    <div className="grid grid-cols-1 gap-[2px] md:grid-cols-3">
      {labels.map((label, idx) => {
        const active = idx < activeCount;
        return (
          <div
            key={label}
            className={`px-4 py-1 text-center ${active ? "bg-[#59b0df] text-white" : "bg-[#dcdcdc] text-[#222]"}`}
          >
            <Text as="span" size="xs" className="font-bold">
              {label}
            </Text>
          </div>
        );
      })}
    </div>
  );
}

