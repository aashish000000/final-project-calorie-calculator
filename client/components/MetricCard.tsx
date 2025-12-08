interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  red: "bg-red-50 text-red-600",
};

export function MetricCard({ title, value, unit, icon, color }: MetricCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === "number" ? value.toFixed(1) : value}
            {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

