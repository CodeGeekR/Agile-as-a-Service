import { useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { $burndownData, $activeSprint } from '../store/data.js';

export default function BurndownChart() {
  const canvasRef = useRef(null);
  const burndownData = useStore($burndownData);
  const activeSprint = useStore($activeSprint);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#F4F5F7';
    ctx.fillRect(0, 0, width, height);

    const { ideal, actual } = burndownData;
    const maxPoints = Math.max(...ideal);
    const days = ideal.length - 1;

    // Draw grid
    ctx.strokeStyle = '#DFE1E6';
    ctx.lineWidth = 1;
    
    // Vertical lines (days)
    for (let i = 0; i <= days; i++) {
      const x = (i / days) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines (points)
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = (i / gridLines) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw ideal burndown line (dashed)
    ctx.strokeStyle = '#00875A';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    
    ideal.forEach((points, index) => {
      const x = (index / days) * width;
      const y = height - (points / maxPoints) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual burndown line
    ctx.strokeStyle = '#0052CC';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    actual.forEach((points, index) => {
      if (points === null) return;
      
      const x = (index / days) * width;
      const y = height - (points / maxPoints) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Add data points
    actual.forEach((points, index) => {
      if (points === null) return;
      
      const x = (index / days) * width;
      const y = height - (points / maxPoints) * height;
      
      ctx.fillStyle = '#0052CC';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Add labels
    ctx.fillStyle = '#172B4D';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    // X-axis labels (days)
    for (let i = 0; i <= days; i += 2) {
      const x = (i / days) * width;
      ctx.fillText(`Día ${i}`, x, height + 15);
    }
    
    // Y-axis labels (points)
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const points = Math.round((maxPoints / gridLines) * (gridLines - i));
      const y = (i / gridLines) * height;
      ctx.fillText(points.toString(), -5, y + 4);
    }

    // Crisis zone warning
    const currentActual = actual[actual.length - 2]; // Last non-null value
    const currentIdeal = ideal[actual.length - 2];
    
    if (currentActual > currentIdeal * 1.2) {
      ctx.fillStyle = '#DE350B';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'left';
      ctx.fillText('⚠️ ZONA DE CRISIS EXISTENCIAL', 20, 30);
    }

    // Trend analysis
    const recentActual = actual.slice(-3).filter(p => p !== null);
    if (recentActual.length >= 2) {
      const trend = recentActual[recentActual.length - 1] - recentActual[0];
      const trendText = trend > 0 ? '📈 Tendencia: Empeorando' : '📉 Tendencia: Mejorando';
      
      ctx.fillStyle = trend > 0 ? '#DE350B' : '#00875A';
      ctx.font = '12px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(trendText, width - 20, 50);
    }

  }, [burndownData]);

  const remainingPoints = activeSprint.totalPoints - activeSprint.completedPoints;
  const daysRemaining = Math.ceil((activeSprint.endDate - new Date()) / (1000 * 60 * 60 * 24));
  const currentVelocity = activeSprint.completedPoints / 11; // 11 days elapsed
  const successProbability = Math.max(0, Math.min(100, 100 - (remainingPoints / (daysRemaining * currentVelocity)) * 20));

  return (
    <div className="bg-white rounded-lg border border-border-color p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Gráfico Burndown: "{activeSprint.name}"
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-600 border-2 border-dashed border-green-600"></div>
            <span className="text-text-secondary">Ideal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-primary"></div>
            <span className="text-text-secondary">Realidad Deplorable</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <canvas 
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full border border-border-color rounded bg-white"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-text-primary">Puntos Restantes</div>
          <div className={`text-xl font-bold ${remainingPoints > 30 ? 'text-red-600' : 'text-orange-600'}`}>
            {remainingPoints}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-text-primary">Días Restantes</div>
          <div className={`text-xl font-bold ${daysRemaining <= 3 ? 'text-red-600' : 'text-orange-600'}`}>
            {daysRemaining}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-text-primary">Velocidad Actual</div>
          <div className={`text-xl font-bold ${currentVelocity < 3 ? 'text-red-600' : 'text-green-600'}`}>
            {currentVelocity.toFixed(1)}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-text-primary">Probabilidad de Éxito</div>
          <div className={`text-xl font-bold ${successProbability < 30 ? 'text-red-600' : successProbability < 70 ? 'text-orange-600' : 'text-green-600'}`}>
            {Math.round(successProbability)}%
          </div>
        </div>
      </div>
      
      <div className={`mt-4 p-3 rounded ${
        successProbability < 30 ? 'bg-red-50 border border-red-200' : 
        successProbability < 70 ? 'bg-yellow-50 border border-yellow-200' :
        'bg-green-50 border border-green-200'
      }`}>
        <p className={`text-sm ${
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
  );
}