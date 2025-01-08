import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default function Script() {
    useEffect(() => {
        // Enable animated theme
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        const chart = am4core.create("chartdiv", am4charts.PieChart3D);
        chart.hiddenState.properties.opacity = 0; // Initial fade-in

        // Add legend
        chart.legend = new am4charts.Legend();

        // Chart data
        chart.data = [
            { country: "Hadir", litres: 501.9 },
            { country: "Sakit", litres: 301.9 },
            { country: "Izin", litres: 201.1 },
            { country: "Terlambat", litres: 165.8 },
        ];

        // Create 3D Pie Series
        const series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "litres";
        series.dataFields.category = "country";

        // Customize labels
        series.alignLabels = false;
        series.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        series.labels.template.radius = am4core.percent(-40);
        series.labels.template.fill = am4core.color("white");

        // Customize colors
        series.colors.list = [
            am4core.color("#1171ba"),
            am4core.color("#fca903"),
            am4core.color("#37db63"),
            am4core.color("#ba113b"),
        ];

        // Cleanup on unmount
        return () => {
            chart.dispose();
        };
    }, []);

    return null; // No visible UI component, chart is rendered in `chartdiv`
}
