import * as React from 'react';

declare module 'recharts' {
  export interface CartesianGridProps {
    refs?: React.Ref<any>;
    strokeDasharray?: string;
    stroke?: string;
  }
  
  export interface XAxisProps {
    refs?: React.Ref<any>;
    dataKey?: string;
    tick?: object;
    angle?: number;
    textAnchor?: string;
    height?: number;
  }
  
  export interface YAxisProps {
    refs?: React.Ref<any>;
    tickFormatter?: (value: any) => string;
    tick?: object;
    width?: number;
  }
  
  export interface BarProps {
    refs?: React.Ref<any>;
    dataKey?: string;
    fill?: string;
    name?: string;
    radius?: number | number[];
    fillOpacity?: number;
  }
  
  export interface TooltipProps {
    refs?: React.Ref<any>;
    formatter?: (value: any, name?: string, props?: any) => any;
    labelFormatter?: (label: any) => string;
    contentStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
  }
  
  export interface LegendProps {
    refs?: React.Ref<any>;
    wrapperStyle?: React.CSSProperties;
    formatter?: (value: any, entry?: any, index?: number) => any;
  }
  
  export interface CellProps {
    refs?: React.Ref<any>;
    fill?: string;
    key?: string;
  }
  
  export interface ReferenceLineProps {
    refs?: React.Ref<any>;
    y?: number;
    stroke?: string;
    strokeDasharray?: string;
    label?: string | object;
  }
  
  export class XAxis extends React.Component<XAxisProps> {}
  export class YAxis extends React.Component<YAxisProps> {}
  export class Bar extends React.Component<BarProps> {}
  export class Tooltip extends React.Component<TooltipProps> {}
  export class Legend extends React.Component<LegendProps> {}
  export class CartesianGrid extends React.Component<CartesianGridProps> {}
  export class Cell extends React.Component<CellProps> {}
  export class ReferenceLine extends React.Component<ReferenceLineProps> {}
}