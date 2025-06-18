document.addEventListener('DOMContentLoaded', function() {
    // Fetch the JSON data
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load JSON');
            }
            return response.json();
        })
        .then(data => {
            createTagDistribution(data);
        })
        .catch(error => console.error('Error:', error));
});

function createTagDistribution(data) {
    // Count occurrences of each tag and store descriptions
    const tagData = {};
    data.forEach(item => {
        item.tags.forEach(tag => {
            if (!tagData[tag]) {
                tagData[tag] = {
                    count: 0,
                    descriptions: []
                };
            }
            tagData[tag].count++;
            tagData[tag].descriptions.push(item.description);
        });
    });

    // Convert to array format for D3
    const pieData = Object.entries(tagData).map(([tag, data]) => ({
        tag,
        count: data.count,
        descriptions: data.descriptions
    }));

    // Set up dimensions
    const width = 800;
    const height = 600;
    const radius = Math.min(width, height) / 2.5;

    // Create color scale
    const color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.tag))
        .range(d3.schemeCategory10);

    // Create tooltip div
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('border', '1px solid #ddd')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
        .style('max-width', '300px')
        .style('max-height', '200px')
        .style('overflow-y', 'auto')
        .style('z-index', '1000');

    // Function to show tooltip
    function showTooltip(event, d) {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);

        const descriptions = d.descriptions.map(desc => 
            `<div style="margin-bottom: 8px; font-size: 13px;">${desc}</div>`
        ).join('');

        tooltip.html(`
            <div style="font-weight: bold; margin-bottom: 8px; color: ${color(d.tag)};">
                ${d.tag} (${d.count} images)
            </div>
            ${descriptions}
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }

    // Function to hide tooltip
    function hideTooltip() {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    }

    // Create SVG
    const svg = d3.select('#tagPieChart')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/2},${height/2})`);

    // Create pie generator
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Add pie slices
    const path = svg.selectAll('path')
        .data(pie(pieData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.tag))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .style('opacity', 1)
                .style('cursor', 'pointer');
            showTooltip(event, d.data);
        })
        .on('mouseout', function() {
            d3.select(this)
                .style('opacity', 0.7);
            hideTooltip();
        });

    // Create legend
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${radius + 40}, ${-radius/2})`);

    // Add legend items
    const legendItems = legend.selectAll('.legend-item')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 30})`)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            // Highlight corresponding pie slice
            svg.selectAll('path')
                .filter(p => p.data.tag === d.tag)
                .style('opacity', 1);
            showTooltip(event, d);
        })
        .on('mouseout', function() {
            // Reset pie slice opacity
            svg.selectAll('path')
                .style('opacity', 0.7);
            hideTooltip();
        });

    // Add colored squares
    legendItems.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', d => color(d.tag))
        .attr('stroke', 'white')
        .style('stroke-width', '1px');

    // Add text labels
    legendItems.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(d => `${d.tag} (${d.count})`)
        .style('font-size', '14px')
        .style('font-family', 'Segoe UI, sans-serif');

    // Add title
    svg.append('text')
        .attr('x', 0)
        .attr('y', -height/2 + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .text('Distribution of Nail Art Tags');
}
