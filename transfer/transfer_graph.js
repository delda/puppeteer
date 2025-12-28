// Locally, use python to start a simple web server
// python3 -m http.server 8000
// http://localhost:8000/transfer_graph.html
fetch('transferNumber.dat')
    .then(response => response.text())
    .then(encodedData => {
        const jsonString = atob(encodedData);
        const data = JSON.parse(jsonString);
        // Enrich data with date objects and grouping keys
        data.forEach(d => {
            d.date = new Date(d.date);
            d.value = d.number;
            // Store original JSON week and season values for labeling
            const jsonWeek = d.week;
            const jsonSeason = d.season;
            // Preserve original season value from JSON for labeling
            d.jsonSeason = jsonSeason;
            // Season grouping
            const m = d.date.getMonth();
            if (m >= 2 && m <= 4) d.season = 'Spring';
            else if (m >= 5 && m <= 7) d.season = 'Summer';
            else if (m >= 8 && m <= 10) d.season = 'Autumn';
            else d.season = 'Winter';
            // Week-season grouping key from JSON fields
            d['week-season'] = `${jsonWeek}-${jsonSeason}`;
            // Day grouping (group by calendar date)
            d.day = d.date.toISOString().split('T')[0];
        });
        // Helper to group items by key
        function groupBy(array, key) {
            return array.reduce((map, item) => {
                (map[item[key]] = map[item[key]] || []).push(item.value);
                return map;
            }, {});
        }
        // Helper to compute averages for groups
        function averages(groups, order) {
            const xs = order.filter(k => groups[k]);
            const ys = xs.map(k => {
                const vals = groups[k];
                return vals.reduce((a, b) => a + b, 0) / vals.length;
            });
            return { x: xs, y: ys };
        }
        // Prepare group maps
        // Group by original JSON season values instead of computed seasons
        const seasonGroups = groupBy(data, 'jsonSeason');
        const weekGroups = groupBy(data, 'week-season');
        const dayGroups = groupBy(data, 'day');
        // Define orders for categories
        // Order seasons by numeric season number from JSON
        const seasonOrder = Object.keys(seasonGroups).sort((a, b) => Number(a) - Number(b));
        // Sort week labels by year and week number
        const weekOrder = Object.keys(weekGroups).sort((a, b) => {
            const [wA, sA] = a.split('-').map(Number);
            const [wB, sB] = b.split('-').map(Number);
            return sA !== sB ? sA - sB : wA - wB;
        });
        // Compute average values per category
        const seasonData = averages(seasonGroups, seasonOrder);
        const weekData = averages(weekGroups, weekOrder);
        const dayOrder = Object.keys(dayGroups).sort();
        const dayData = averages(dayGroups, dayOrder);
        // Create traces for each grouping + all raw data
        const allTrace = {
            x: data.map(d => d.date),
            y: data.map(d => d.value),
            mode: 'lines+markers',
            name: 'all'
        };
        const seasonTrace = { x: seasonData.x, y: seasonData.y, type: 'bar', name: 'Stagione', marker: { color: '#3ab7e0' }, visible: false };
        const weekTrace = { x: weekData.x, y: weekData.y, type: 'bar', name: 'Settimana', marker: { color: '#3a74e0' }, visible: false };
        const dayTrace = { x: dayData.x, y: dayData.y, type: 'bar', name: 'Giorno', marker: { color: '#043288' }, visible: false };
        // Layout with buttons to switch grouping and raw data view
        const layout = {
            title: 'Tutti i trasferimenti registrati',
            xaxis: { title: 'Data', type: 'date' },
            yaxis: { title: 'Numero trasferimenti' },
            updatemenus: [{
                x: 0.1,
                y: 1.1,
                type: 'buttons',
                direction: 'left',
                showactive: true,
                active: 3,
                buttons: [
                    {
                        method: 'update',
                        args: [
                            { visible: [false, true, false, false] },
                            { title: 'Media trasferimenti per stagione', xaxis: { title: 'Stagione', type: 'category' } }
                        ],
                        label: 'Stagione'
                    },
                    {
                        method: 'update',
                        args: [
                            { visible: [false, false, true, false] },
                            { title: 'Media trasferimenti per settimana', xaxis: { title: 'Settimana', type: 'category' } }
                        ],
                        label: 'Settimana'
                    },
                    {
                        method: 'update',
                        args: [
                            { visible: [false, false, false, true] },
                            {
                                title: 'Media trasferimenti per giorno',
                                xaxis: {
                                    title: 'Giorno',
                                    type: 'date',
                                    tickmode: 'linear',
                                    tick0: dayOrder[0],
                                    dtick: 24 * 60 * 60 * 1000,
                                    range: [dayOrder[0], dayOrder[dayOrder.length - 1]]
                                }
                            }
                        ],
                        label: 'Giorno'
                    },
                    {
                        method: 'update',
                        args: [
                            { visible: [true, false, false, false] },
                            {
                                title: 'Tutti i trasferimenti registrati',
                                xaxis: { title: 'Data', type: 'date' },
                                yaxis: { title: 'Numero trasferimenti' }
                            }
                        ],
                        label: 'All'
                    }
                ]
            }]
        };
        // Render initial plot with raw data
        Plotly.newPlot('chart', [allTrace, seasonTrace, weekTrace, dayTrace], layout);
    })
    .catch(error => console.error('Error loading data:', error));
