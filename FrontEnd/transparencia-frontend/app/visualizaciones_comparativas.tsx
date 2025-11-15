// components/VisualizacionesComparativas.tsx
'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Datos mock - Reemplazar con tu API
const departamentos = [
  'Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Santander',
  'Bolívar', 'Cundinamarca', 'Norte de Santander', 'Tolima', 'Córdoba',
  'Huila', 'Nariño', 'Meta', 'Caldas', 'Cesar'
];

const años = ['2019', '2020', '2021', '2022', '2023', '2024'];

const categorias = [
  'Educación', 'Salud', 'Vivienda', 'Alimentación', 'Empleo', 'Transporte'
];

// Generar datos mock más realistas
const generarDatosComparativos = () => {
  return departamentos.map((dept, idx) => {
    const base = 50000000000 + (idx * 15000000000);
    return {
      departamento: dept,
      '2019': base * 0.7,
      '2020': base * 0.8,
      '2021': base * 0.9,
      '2022': base * 0.95,
      '2023': base,
      '2024': base * 1.05,
      beneficiarios2024: Math.floor((base / 150000) * (1 + Math.random() * 0.3)),
    };
  });
};

const generarDatosPorCategoria = (departamento: string) => {
  return categorias.map((cat, idx) => ({
    categoria: cat,
    monto: 30000000000 + (Math.random() * 40000000000),
    beneficiarios: 150000 + Math.floor(Math.random() * 300000),
  }));
};

const generarComparacionRegional = () => {
  const regiones = ['Andina', 'Caribe', 'Pacífica', 'Orinoquía', 'Amazonía'];
  return regiones.map(region => ({
    region,
    educacion: 60 + Math.random() * 30,
    salud: 50 + Math.random() * 40,
    vivienda: 40 + Math.random() * 35,
    alimentacion: 45 + Math.random() * 30,
    empleo: 35 + Math.random() * 25,
  }));
};

export default function VisualizacionesComparativas() {
  const [añoSeleccionado1, setAñoSeleccionado1] = useState('2023');
  const [añoSeleccionado2, setAñoSeleccionado2] = useState('2024');
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('Bogotá D.C.');
  const [vistaActual, setVistaActual] = useState<'departamentos' | 'regiones' | 'evolucion'>('departamentos');
  const [top, setTop] = useState(10);

  const datosComparativos = generarDatosComparativos();
  const datosPorCategoria = generarDatosPorCategoria(departamentoSeleccionado);
  const datosRegionales = generarComparacionRegional();

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Preparar datos para comparación año vs año
  const datosComparacionAnual = datosComparativos.slice(0, top).map(dept => {
    const valor1 = dept[añoSeleccionado1 as keyof typeof dept];
    const valor2 = dept[añoSeleccionado2 as keyof typeof dept];
    return {
      departamento: dept.departamento,
      [añoSeleccionado1]: typeof valor1 === 'number' ? valor1 : 0,
      [añoSeleccionado2]: typeof valor2 === 'number' ? valor2 : 0,
    };
  });

  // Datos de evolución temporal para un departamento
  const datosEvolucion = años.map(año => {
    const dept = datosComparativos.find(d => d.departamento === departamentoSeleccionado);
    const valor = dept ? dept[año as keyof typeof dept] : 0;
    return {
      año,
      monto: typeof valor === 'number' ? valor : 0,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Visualizaciones Comparativas
          </h1>
          <p className="text-gray-600">
            Compara montos de subsidios y beneficiarios por región y año
          </p>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setVistaActual('departamentos')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              vistaActual === 'departamentos'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
            Por Departamento
          </button>
          <button
            onClick={() => setVistaActual('regiones')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              vistaActual === 'regiones'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
             Por Región
          </button>
          <button
            onClick={() => setVistaActual('evolucion')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              vistaActual === 'evolucion'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
            Evolución Temporal
          </button>
        </div>

        {/* Vista: Comparación por Departamentos */}
        {vistaActual === 'departamentos' && (
          <div className="space-y-6">
            {/* Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros de Comparación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año 1
                  </label>
                  <select
                    value={añoSeleccionado1}
                    onChange={(e) => setAñoSeleccionado1(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {años.map(año => (
                      <option key={año} value={año}>{año}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año 2
                  </label>
                  <select
                    value={añoSeleccionado2}
                    onChange={(e) => setAñoSeleccionado2(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {años.map(año => (
                      <option key={año} value={año}>{año}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Departamentos
                  </label>
                  <select
                    value={top}
                    onChange={(e) => setTop(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={15}>Top 15</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gráfico de Comparación Anual */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Comparación de Montos: {añoSeleccionado1} vs {añoSeleccionado2}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={datosComparacionAnual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="departamento" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                  />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(value)}
                  />
                  <Legend />
                  <Bar dataKey={añoSeleccionado1} fill="#7C3AED" name={añoSeleccionado1} radius={[4, 4, 0, 0]} />
                  <Bar dataKey={añoSeleccionado2} fill="#3B82F6" name={añoSeleccionado2} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Beneficiarios */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Beneficiarios por Departamento (2024)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={datosComparativos.slice(0, top)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="departamento" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                  />
                  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  <Bar 
                    dataKey="beneficiarios2024" 
                    fill="#10B981" 
                    name="Beneficiarios"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla Comparativa Detallada */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Tabla Comparativa Detallada
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Departamento</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{añoSeleccionado1}</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">{añoSeleccionado2}</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Variación</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Beneficiarios</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {datosComparacionAnual.map((dept) => {
                      const valor1 = dept[añoSeleccionado1 as keyof typeof dept];
                      const valor2 = dept[añoSeleccionado2 as keyof typeof dept];
                      const val1 = typeof valor1 === 'number' ? valor1 : 0;
                      const val2 = typeof valor2 === 'number' ? valor2 : 0;
                      const variacion = ((val2 - val1) / val1) * 100;
                      const deptData = datosComparativos.find(d => d.departamento === dept.departamento);
                      return (
                        <tr key={dept.departamento} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {dept.departamento}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            {formatCurrency(val1)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            {formatCurrency(val2)}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${
                            variacion >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {variacion >= 0 ? '↑' : '↓'} {Math.abs(variacion).toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            {deptData ? formatNumber(deptData.beneficiarios2024) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vista: Comparación por Regiones */}
        {vistaActual === 'regiones' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Comparación Regional por Categoría
              </h3>
              <p className="text-gray-600 mb-6">
                Comparación de inversión en diferentes categorías entre regiones de Colombia
              </p>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={datosRegionales}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="region" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Educación" 
                    dataKey="educacion" 
                    stroke="#7C3AED" 
                    fill="#7C3AED" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Salud" 
                    dataKey="salud" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Vivienda" 
                    dataKey="vivienda" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3} 
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datosRegionales.map((region, idx) => (
                <div key={region.region} className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    Región {region.region}
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(region).filter(([key]) => key !== 'region').map(([categoria, valor]) => (
                      <div key={categoria}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {categoria}
                          </span>
                          <span className="text-sm font-semibold text-purple-600">
                            {(valor as number).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${valor}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista: Evolución Temporal */}
        {vistaActual === 'evolucion' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Evolución Temporal de Subsidios
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Departamento
                  </label>
                  <select
                    value={departamentoSeleccionado}
                    onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {departamentos.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={datosEvolucion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="año" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(value)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="monto" 
                    stroke="#7C3AED" 
                    strokeWidth={3}
                    name="Monto de Subsidios"
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Distribución por Categoría */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Distribución por Categoría - {departamentoSeleccionado}
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={datosPorCategoria} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis dataKey="categoria" type="category" width={120} />
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(value)}
                  />
                  <Bar dataKey="monto" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}