import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ResponsiveContainer, AreaChart, CartesianGrid, Area, XAxis, YAxis, } from 'recharts';
export function BaseChart(props) {
    return (_jsx(ResponsiveContainer, { width: '100%', height: '100%', children: _jsxs(AreaChart, { data: props.data, children: [_jsx(CartesianGrid, { stroke: "#333", strokeDasharray: "5 5", fill: "#1C1C1C" }), _jsx(Area, { fillOpacity: 0.3, fill: props.fill, stroke: props.stroke, strokeWidth: 3, type: "monotone", dataKey: "value", isAnimationActive: false }), _jsx(XAxis, { stroke: "transparent", height: 0 }), _jsx(YAxis, { domain: [0, 100], stroke: "transparent", width: 0 })] }) }));
}
