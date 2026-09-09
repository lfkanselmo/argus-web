import { Component, DestroyRef, ElementRef, afterNextRender, effect, inject, input, viewChild } from '@angular/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, MarkLineComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PriceHistoryPoint } from '../../../core/models/price-history-point.model';

echarts.use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, CanvasRenderer]);

@Component({
  selector: 'app-price-chart',
  template: '<div class="chart" #chartEl></div>',
  styleUrl: './price-chart.scss'
})
export class PriceChart {
  history = input.required<PriceHistoryPoint[]>();
  targetPrice = input<number | null>(null);

  private readonly chartEl = viewChild.required<ElementRef<HTMLDivElement>>('chartEl');
  private chart?: echarts.ECharts;
  private readonly resizeHandler = () => this.chart?.resize();

  constructor() {
    afterNextRender(() => {
      this.chart = echarts.init(this.chartEl().nativeElement);
      this.applyOption();
      window.addEventListener('resize', this.resizeHandler);
    });

    effect(() => {
      this.history();
      this.targetPrice();
      if (this.chart) {
        this.applyOption();
      }
    });

    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('resize', this.resizeHandler);
      this.chart?.dispose();
    });
  }

  private applyOption(): void {
    const style = getComputedStyle(document.documentElement);
    const token = (name: string) => style.getPropertyValue(name).trim();

    const points = this.history()
      .filter((point) => point.status === 'OK' && point.price !== null)
      .map((point) => [point.scrapedAt, point.price] as [string, number]);

    const target = this.targetPrice();

    this.chart?.setOption(
      {
        textStyle: { fontFamily: token('--font-body') },
        grid: { left: 56, right: 24, top: 24, bottom: 32 },
        xAxis: {
          type: 'time',
          axisLine: { lineStyle: { color: token('--color-border') } },
          axisLabel: { color: token('--color-text-muted') }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: token('--color-border') } },
          axisLabel: { color: token('--color-text-muted') }
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value: number | string) => '$' + new Intl.NumberFormat('es-CO').format(Number(value))
        },
        series: [
          {
            type: 'line',
            data: points,
            smooth: true,
            symbolSize: 6,
            lineStyle: { color: token('--color-primary'), width: 2.5 },
            itemStyle: { color: token('--color-primary') },
            areaStyle: { color: token('--color-primary'), opacity: 0.08 },
            markLine:
              target !== null
                ? {
                    symbol: 'none',
                    silent: true,
                    lineStyle: { color: token('--color-accent'), type: 'dashed' },
                    label: { color: token('--color-accent'), formatter: 'Objetivo' },
                    data: [{ yAxis: target }]
                  }
                : undefined
          }
        ]
      },
      true
    );
  }
}
