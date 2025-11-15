// components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Datos mock - Reemplazar con tu API
const mockData = {
  totalSubsidios: 1250000000000, // En pesos colombianos
  totalBeneficiarios: 8500000,
  subsidiosActivos: 247,
  ultimaActualizacion: '2025-11-10',
  
  topDepartamentos: [
    { nombre: 'Bogotá D.C.', monto: 250000000000, beneficiarios: 1500000 },
    { nombre: 'Antioquia', monto: 180000000000, beneficiarios: 1200000 },
    { nombre: 'Valle del Cauca', monto: 150000000000, beneficiarios: 950000 },
    { nombre: 'Atlántico', monto: 120000000000, beneficiarios: 800000 },
    { nombre: 'Santander', monto: 95000000000, beneficiarios: 650000 },
  ],
  
  evolucionAnual: [
    { año: '2019', monto: 800000000000, beneficiarios: 6500000 },
    { año: '2020', monto: 950000000000, beneficiarios: 7200000 },
    { año: '2021', monto: 1050000000000, beneficiarios: 7800000 },
    { año: '2022', monto: 1150000000000, beneficiarios: 8100000 },
    { año: '2023', monto: 1200000000000, beneficiarios: 8300000 },
    { año: '2024', monto: 1250000000000, beneficiarios: 8500000 },
  ],
  
  distribucionPorCategoria: [
    { nombre: 'Educación', valor: 35, monto: 437500000000 },
    { nombre: 'Salud', valor: 28, monto: 350000000000 },
    { nombre: 'Vivienda', valor: 18, monto: 225000000000 },
    { nombre: 'Alimentación', valor: 12, monto: 150000000000 },
    { nombre: 'Otros', valor: 7, monto: 87500000000 },
  ],
  
  alertas: [
    { id: 1, tipo: 'info', mensaje: 'Nuevos subsidios de educación disponibles', fecha: '2025-11-10' },
    { id: 2, tipo: 'success', mensaje: 'Base de datos actualizada con información de 2024', fecha: '2025-11-08' },
    { id: 3, tipo: 'warning', mensaje: 'Algunos programas próximos a cerrar inscripciones', fecha: '2025-11-05' },
  ]
};

const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const [data, setData] = useState(mockData);
  const [selectedYear, setSelectedYear] = useState('2024');

  // Formatear números
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Panel de Control Ciudadano
          </h1>
          <p className="text-gray-600">
            Visualiza datos clave sobre subsidios y programas del Estado Colombiano
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Última actualización: {formatDate(data.ultimaActualizacion)}
          </p>
        </div>

        {/* Alertas */}
        <div className="mb-6 space-y-2">
          {data.alertas.map((alerta) => (
            <div
              key={alerta.id}
              className={`p-4 rounded-lg border-l-4 ${
                alerta.tipo === 'info' ? 'bg-blue-50 border-blue-500 text-blue-900' :
                alerta.tipo === 'success' ? 'bg-green-50 border-green-500 text-green-900' :
                'bg-yellow-50 border-yellow-500 text-yellow-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{alerta.mensaje}</p>
                  <p className="text-sm opacity-75 mt-1">{formatDate(alerta.fecha)}</p>
                </div>
                <span className="text-2xl ml-4">
                  {alerta.tipo === 'info' ? 'ℹ️' : alerta.tipo === 'success' ? '✅' : '⚠️'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Subsidios</h3>
              <span className="text-3xl"></span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{data.subsidiosActivos}</p>
            <p className="text-sm text-gray-500 mt-1">Programas activos</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Monto Total</h3>
              <span className="text-3xl"></span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.totalSubsidios)}
            </p>
            <p className="text-sm text-green-600 mt-1">↑ 4.2% vs año anterior</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Beneficiarios</h3>
              <span className="text-3xl"></span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(data.totalBeneficiarios)}
            </p>
            <p className="text-sm text-green-600 mt-1">↑ 2.4% vs año anterior</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Cobertura</h3>
              <span className="text-3xl"></span>
            </div>
            <p className="text-3xl font-bold text-gray-900">32</p>
            <p className="text-sm text-gray-500 mt-1">Departamentos</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Evolución Anual */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Evolución Anual de Subsidios
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.evolucionAnual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="año" />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000000000000).toFixed(1)}T`}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="monto" 
                  stroke="#7C3AED" 
                  strokeWidth={3}
                  name="Monto Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución por Categoría */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Distribución por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.distribucionPorCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.nombre}: ${entry.valor}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {data.distribucionPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value}% - ${formatCurrency(props.payload.monto)}`,
                    ''
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Departamentos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Top 5 Departamentos por Monto de Subsidios
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.topDepartamentos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000000).toFixed(0)}B`} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar dataKey="monto" fill="#7C3AED" name="Monto Total" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Tabla detallada */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Departamento</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Monto</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Beneficiarios</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topDepartamentos.map((dept, index) => (
                  <tr key={dept.nombre} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {formatCurrency(dept.monto)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {formatNumber(dept.beneficiarios)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}