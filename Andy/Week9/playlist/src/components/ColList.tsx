import ColItem from "./ColItem.tsx";
import ColSummary from "./ColSummary.tsx";
// import { useSelector } from "react-redux";
// import type { RootState } from "../store/store.ts";
import { useColInfo } from "../hooks/useColStore.ts";

const ColList = () => {
  // const { items } = useSelector(
  //   (state: RootState) => state.cart
  // );
  const { items } = useColInfo();

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-[#1d1d1f] mb-2 tracking-tight">
            나의 컬렉션
          </h1>
          <p className="text-lg text-[#86868b]">
            총 {items.length}개의 앨범
          </p>
        </div>

        {/* Album Grid */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="animate-[fadeSlideUp_0.5s_ease-out]"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
            >
              <ColItem
                key={item.id}
                lp={item}
              />
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <ColSummary />
      </div>
    </div>
  );
};

export default ColList;
