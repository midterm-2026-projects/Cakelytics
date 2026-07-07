import { useState } from 'react';
import { Layout } from '../../components/Sidebar'; 
import PerformanceTimeframe from './performanceTimeframe';
import FourKpi from './fourKPI';
import StackedBar from './stackedBar';
import OrderVolumeHeatmap from './heatmap';
import TopProductsList from './topProducts';
import ForecastTimeframe from './forecastTimeframe';
import SalesForecast from './salesForecast';
import ProductForecasting from './productForecast';
import ActionableRecommendation from './actionableRecommendation';

export default function AnalyticsPage() {
  const [perfTimeframe, setPerfTimeframe] = useState('Last 7 Days');
  const [forecastTimeframe, setForecastTimeframe] = useState('30d');

  return (
    <Layout onLogout={() => console.log('User logged out')}>
      <div className="w-full min-w-0 overflow-x-hidden pb-6">
        <div className="flex flex-col gap-5 w-full">
          
          {/* ─── INAYOS NA TOP SECTION (Magkatabi na sa mobile) ─── */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            <h2 className="text-base sm:text-xl font-bold text-[#3d2410] leading-tight">
              Business Performance Analytics
            </h2>
            <div className="shrink-0">
              <PerformanceTimeframe 
                value={perfTimeframe} 
                onChange={setPerfTimeframe} 
              />
            </div>
          </div>

          <div className="w-full">
            <FourKpi period={perfTimeframe} />
          </div>

          <div className="w-full h-auto">
            <StackedBar period={perfTimeframe} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            <div className="w-full min-w-0"><OrderVolumeHeatmap /></div>
            
            <div className="w-full min-w-0"><TopProductsList period={perfTimeframe} /></div>
          </div>

          {/* ─── FORECASTING & INSIGHTS SECTION (Magkatabi na rin sa mobile) ─── */}
          <div className="mt-4 pt-6 border-t border-[#e7ded4] flex flex-col gap-5 w-full">
            
            <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
              <h2 className="text-base sm:text-xl font-bold text-[#3d2410] leading-tight">
                AI Business Insights
              </h2>
              <div className="shrink-0">
                <ForecastTimeframe 
                  defaultValue={forecastTimeframe} 
                  onChange={setForecastTimeframe} 
                />
              </div>
            </div>

            <div className="w-full h-auto">
              <SalesForecast title="Actual vs. AI Forecast" view={forecastTimeframe} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
              <div className="w-full min-w-0">
                <ProductForecasting view={forecastTimeframe} />
              </div>
              <div className="w-full min-w-0">
                <ActionableRecommendation />
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}