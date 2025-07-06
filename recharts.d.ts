import * as React from 'react';

declare module 'recharts' {
  export interface XAxisProps {
    refs?: React.Ref<any>;
  }
  
  export interface YAxisProps {
    refs?: React.Ref<any>;
  }
  
  export interface BarProps {
    refs?: React.Ref<any>;
  }
  
  export interface TooltipProps {
    refs?: React.Ref<any>;
  }
  
  export interface LegendProps {
    refs?: React.Ref<any>;
  }
  
  export interface CartesianGridProps {
    refs?: React.Ref<any>;
  }
  
  export interface CellProps {
    refs?: React.Ref<any>;
  }
  
  export class XAxis extends React.Component<XAxisProps> {}
  export class YAxis extends React.Component<YAxisProps> {}
  export class Bar extends React.Component<BarProps> {}
  export class Tooltip extends React.Component<TooltipProps> {}
  export class Legend extends React.Component<LegendProps> {}
  export class CartesianGrid extends React.Component<CartesianGridProps> {}
  export class Cell extends React.Component<CellProps> {}
}