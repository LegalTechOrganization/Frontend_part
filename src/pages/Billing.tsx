import PlanCard from "@/components/PlanCard";
import UsageMeter from "@/components/UsageMeter";

const Billing = () => {
    return (
        <div>
            <h1 className="text-3xl font-playfair mb-8">Кабинет</h1>
            <div className="space-y-8">
                <PlanCard />
                <UsageMeter />
            </div>
        </div>
    );
};

export default Billing;
