import Graphs from "@/components/dashboard/Graphs";
import SummaryCard from "@/components/dashboard/SummaryCard";
import TransactionsList from "@/components/dashboard/TransactionsList";
import {
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
  TrendingUpIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

export default function dashboard() {
  const SummaryCardsData = [
    {
      id: 1,
      title: "balance",
      amount: 20000,
      description: "what you have saved currently",
      icon: Wallet01Icon,
      trendPercentage: 20,
      trendIcon: TrendingUpIcon,
    },
    {
      id: 2,
      title: "income",
      amount: 15000,
      description: "your earnings",
      icon: MoneyReceiveCircleIcon,
      trendPercentage: 8,
      trendIcon: TrendingUpIcon,
    },
    {
      id: 3,
      title: "expense",
      amount: 6000,
      description: "what you hvae spent",
      icon: MoneySendCircleIcon,
      trendPercentage: 4.5,
      trendIcon: TrendingUpIcon,
    },
  ];
  return (
    <main className="w-full h-full flex flex-col gap-3">
      <div className="w-full h-auto  flex gap-3">
        {SummaryCardsData.map((card) => (
          <SummaryCard
            key={card.id}
            title={card.title}
            amount={card.amount}
            description={card.description}
            icon={card.icon}
            trendPercentage={card.trendPercentage}
            trendIcon={card.trendIcon}
          />
        ))}
      </div>
      <Graphs/>
      <TransactionsList/>
    </main>
  );
}
