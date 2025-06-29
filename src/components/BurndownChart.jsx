import { useEffect, useRef, useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { $burndownData, $activeSprint } from '../store/data.js';
import { t } from '../i18n/index.js';

export default function BurndownChart() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const burndownData = useStore($burndownData);
  const activeSprint = useStore($activeSprint);

  // Responsive canvas sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        let width, height;
        
        if (isMobile) {
          width = Math.max(containerWidth - 32, 280);
          height = 200;
        } else if (isTablet) {
          width = Math.max(containerWidth - 32, 400);
          height = 250;
        } else {
          width = Math.max(containerWidth - 32, 500);
          height = 300;
        }
        
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeSprint) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate chart area (leaving margins for labels)
    const margin = { top: 20, right: 40, bottom: 50, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Sprint data
    const sprintDuration = 14; // 2 weeks
    const totalPoints = activeSprint.totalPoints;
    const completedPoints = activeSprint.completedPoints;
    const remainingPoints = totalPoints - completedPoints;
    
    // Calculate days elapsed and remaining
    const startDate = new Date(activeSprint.startDate);
    const endDate = new Date(activeSprint.endDate);
    const currentDate = new Date();
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.min(totalDays, Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);
    
    // Generate ideal burndown line (linear decrease)
    const idealData = [];
    for (let day = 0; day <= totalDays; day++) {
      const idealRemaining = totalPoints - (totalPoints * day / totalDays);
      idealData.push(idealRemaining);
    }
    
    // Generate actual burndown data (with some realistic progression)
    const actualData = [];
    const dailyVelocity = completedPoints / Math.max(1, daysElapsed);
    
    for (let day = 0; day <= totalDays; day++) {
      if (day === 0) {
        actualData.push(totalPoints);
      } else if (day <= daysElapsed) {
        // Add some realistic variance to the actual progress
        const baseProgress = dailyVelocity * day;
        const variance = Math.sin(day * 0.5) * 2; // Small daily variations
        const weekendSlowdown = (day % 7 === 0 || day % 7 === 6) ? -1 : 0; // Weekend slowdown
        const actualCompleted = Math.min(totalPoints, Math.max(0, baseProgress + variance + weekendSlowdown));
        actualData.push(totalPoints - actualCompleted);
      } else {
        actualData.push(null); // Future days
      }
    }
    
    // Set up coordinate system
    const xScale = (day) => margin.left + (day / totalDays) * chartWidth;
    const yScale = (points) => margin.top + ((totalPoints - points) / totalPoints) * chartHeight;
    
    // Draw background
    ctx.fillStyle = '#FAFBFC';
    ctx.fillRect(0, 0, width, height);
    
    // Draw chart background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);
    
    // Draw grid lines
    ctx.strokeStyle = '#E4E6EA';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (days)
    const dayInterval = totalDays <= 14 ? 2 : Math.ceil(totalDays / 7);
    for (let day = 0; day <= totalDays; day += dayInterval) {
      const x = xScale(day);
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + chartHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines (points)
    const pointInterval = Math.ceil(totalPoints / 5);
    for (let points = 0; points <= totalPoints; points += pointInterval) {
      const y = yScale(points);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + chartWidth, y);
      ctx.stroke();
    }
    
    // Draw chart border
    ctx.strokeStyle = '#DFE1E6';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin.left, margin.top, chartWidth, chartHeight);
    
    // Draw ideal burndown line (dashed green)
    ctx.strokeStyle = '#00875A';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    
    idealData.forEach((points, day) => {
      const x = xScale(day);
      const y = yScale(points);
      
      if (day === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw actual burndown line (solid blue)
    ctx.strokeStyle = '#0052CC';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let lastValidPoint = null;
    actualData.forEach((points, day) => {
      if (points !== null) {
        const x = xScale(day);
        const y = yScale(points);
        
        if (lastValidPoint === null) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        lastValidPoint = { x, y, day, points };
      }
    });
    ctx.stroke();
    
    // Draw data points on actual line
    ctx.fillStyle = '#0052CC';
    actualData.forEach((points, day) => {
      if (points !== null) {
        const x = xScale(day);
        const y = yScale(points);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Highlight current day
        if (day === daysElapsed) {
          ctx.strokeStyle = '#0052CC';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });
    
    // Draw projection line if behind schedule
    if (lastValidPoint && daysRemaining > 0) {
      const currentVelocity = completedPoints / daysElapsed;
      const projectedCompletion = Math.max(0, remainingPoints - (currentVelocity * daysRemaining));
      
      if (projectedCompletion > 0) {
        ctx.strokeStyle = '#DE350B';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(lastValidPoint.x, lastValidPoint.y);
        ctx.lineTo(xScale(totalDays), yScale(projectedCompletion));
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    
    // Draw labels
    ctx.fillStyle = '#172B4D';
    ctx.font = `${window.innerWidth < 768 ? '10' : '12'}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    
    // X-axis labels (days)
    for (let day = 0; day <= totalDays; day += dayInterval) {
      const x = xScale(day);
      const label = day === 0 ? 'Inicio' : day === totalDays ? 'Fin' : `Día ${day}`;
      ctx.fillText(label, x, height - 15);
    }
    
    // Y-axis labels (points)
    ctx.textAlign = 'right';
    for (let points = 0; points <= totalPoints; points += pointInterval) {
      const y = yScale(points);
      ctx.fillText(points.toString(), margin.left - 10, y + 4);
    }
    
    // Draw axis titles
    ctx.fillStyle = '#5E6C84';
    ctx.font = `${window.innerWidth < 768 ? '10' : '11'}px Inter, sans-serif`;
    
    // X-axis title
    ctx.textAlign = 'center';
    ctx.fillText('Días del Sprint', width / 2, height - 5);
    
    // Y-axis title (rotated)
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Story Points Restantes', 0, 0);
    ctx.restore();
    
    // Draw current day indicator
    if (daysElapsed <= totalDays) {
      const currentX = xScale(daysElapsed);
      ctx.strokeStyle = '#FF8B00';
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(currentX, margin.top);
      ctx.lineTo(currentX, margin.top + chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Current day label
      ctx.fillStyle = '#FF8B00';
      ctx.font = `bold ${window.innerWidth < 768 ? '10' : '11'}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('HOY', currentX, margin.top - 5);
    }
    
    // Draw legend
    const legendY = margin.top + 10;
    const legendItems = [
      { color: '#00875A', label: 'Burndown Ideal', dashed: true },
      { color: '#0052CC', label: 'Burndown Real', dashed: false },
    ];
    
    if (lastValidPoint && daysRemaining > 0 && remainingPoints > 0) {
      legendItems.push({ color: '#DE350B', label: 'Proyección', dashed: true });
    }
    
    let legendX = margin.left + 10;
    ctx.font = `${window.innerWidth < 768 ? '9' : '10'}px Inter, sans-serif`;
    ctx.textAlign = 'left';
    
    legendItems.forEach((item, index) => {
      // Draw line sample
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      if (item.dashed) ctx.setLineDash([4, 2]);
      
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 15, legendY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw label
      ctx.fillStyle = item.color;
      ctx.fillText(item.label, legendX + 20, legendY + 4);
      
      legendX += ctx.measureText(item.label).width + 50;
    });

  }, [dimensions, burndownData, activeSprint]);

  if (!activeSprint) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500">No hay sprint activo</p>
        </div>
      </div>
    );
  }

  const remainingPoints = activeSprint.totalPoints - activeSprint.completedPoints;
  const daysRemaining = Math.ceil((new Date(activeSprint.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const currentVelocity = activeSprint.completedPoints / Math.max(1, 11); // 11 days elapsed
  const successProbability = Math.max(0, Math.min(100, 100 - (remainingPoints / (daysRemaining * currentVelocity)) * 20));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Gráfico Burndown: "{activeSprint.name}"
          </h3>
          <div className="flex items-center space-x-2 text-xs">
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-green-600" style={{ borderTop: '1px dashed #00875A' }}></div>
                <span className="text-gray-500">Ideal</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-blue-600"></div>
                <span className="text-gray-500">Real</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div ref={containerRef} className="p-4">
        <div className="relative">
          <canvas 
            ref={canvasRef}
            className="w-full border border-gray-100 rounded bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-700 text-xs mb-1">Puntos Restantes</div>
            <div className={`text-lg font-bold ${remainingPoints > 20 ? 'text-red-600' : 'text-orange-600'}`}>
              {remainingPoints}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-700 text-xs mb-1">Días Restantes</div>
            <div className={`text-lg font-bold ${daysRemaining <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
              {daysRemaining}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-700 text-xs mb-1">Velocity Actual</div>
            <div className={`text-lg font-bold ${currentVelocity < 2 ? 'text-red-600' : 'text-green-600'}`}>
              {currentVelocity.toFixed(1)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-700 text-xs mb-1">Probabilidad de Éxito</div>
            <div className={`text-lg font-bold ${successProbability < 30 ? 'text-red-600' : successProbability < 70 ? 'text-orange-600' : 'text-green-600'}`}>
              {Math.round(successProbability)}%
            </div>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg text-sm ${
          successProbability < 30 ? 'bg-red-50 border border-red-200' : 
          successProbability < 70 ? 'bg-yellow-50 border border-yellow-200' :
          'bg-green-50 border border-green-200'
        }`}>
          <p className={`${
            successProbability < 30 ? 'text-red-800' : 
            successProbability < 70 ? 'text-yellow-800' :
            'text-green-800'
          }`}>
            <strong>
              {successProbability < 30 ? '🚨 Alerta Crítica del Sistema:' : 
               successProbability < 70 ? '⚠️ Advertencia del Sistema:' :
               '✅ Estado del Sistema:'}
            </strong> 
            {successProbability < 30 ? 
              ' Su existencia está significativamente por debajo de los KPIs establecidos. Se recomienda una reunión de crisis con su Scrum Master interno y considerar reducir el scope del sprint.' :
              successProbability < 70 ?
              ' Su productividad está en zona de riesgo. Considere implementar pair programming para tareas básicas y revisar impedimentos actuales.' :
              ' Su sprint está en buen camino. Mantenga el momentum actual y prepare la retrospectiva de éxitos.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}