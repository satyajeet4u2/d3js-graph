const pBrowser = document.querySelector('p');
const pd3 = d3.select('p')
console.log(pBrowser);
console.log(pd3);


const data = [10, 20, 30, 40, 50];

const el = d3.select('ul')
    .selectAll('li')
    .data(data)
    .join(
        enter => {
            return enter.append('li')
                .style('color', 'red')
                .style('font-size', '50px',)
        },
        update => update.style('color', 'green',)
            .style('font-size', '50px',),
        exit => exit.remove()
    )
    .text(d => d)

console.log('d3 selection', el);

// async function getData(){
//     const getdata = await d3.json('data.json')
//     console.log(getdata)
// }

async function drawGraph() {

    // Data
    const getdata = await d3.json('data.json')
    // console.log(getdata)

    const xAxis = (d) => d.currently.humidity
    const yAxis = (d) => d.currently.apparentTemperature

    // Dimesion
    let dimension = {
        width: 800,
        height: 800,
        margin: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }

    }

    const dimensionCtrlWidth = dimension.width - dimension.margin.left - dimension.margin.right
    const dimensionCtrlHeight = dimension.height - dimension.margin.top - dimension.margin.bottom

    //    scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(getdata, xAxis))
        .range([0, dimensionCtrlWidth])


    const yScale = d3.scaleLinear()
        .domain(d3.extent(getdata, yAxis))
        .range([dimensionCtrlWidth, 0])

    const negYScale = d3.scaleLinear()
        .domain(d3.extent(getdata, yAxis))
        .range([dimensionCtrlWidth, dimensionCtrlWidth*2])

    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimension.width)
        .attr('height', 1500)
    const ctr = svg.append('g')
        .attr(
            'transform',
            `translate(${dimension.margin.left}, ${dimension.margin.top})`,
        )

    // ctr.append('circle')
    //    .attr('r', 50)
    //    .attr('fill', 'purple')
    //    .attr('stroke', 'green')
    //    .attr('stroke-width', 5)

    //  axis
    const xAxisLine = d3.axisBottom(xScale)
                        .ticks(5)
                        .tickFormat((d) => d * 100 +  '%')
    const yAxisLine = d3.axisLeft(yScale)
    const negYAxisLine = d3.axisLeft(negYScale)

    ctr.selectAll('circle')
        .data(getdata)
        .join('circle')
        .attr('cx', d => xScale(xAxis(d)))
        .attr('cy', d => yScale(yAxis(d)))
        .attr('r', 5)
        .attr('fill', 'purple')


    let xAxisGroup = ctr.append('g')
        .call(xAxisLine)
        .style('transform', `translateY(${dimensionCtrlHeight}px)`)

    let yAxisGroup = ctr.append('g')
        .call(yAxisLine)
    // .style('transform', `translateX(${dimensionCtrlWidth}px)`)

    let negYaxisGroup = ctr.append('g')
        .call(negYAxisLine)



    xAxisGroup.append('text')
        .attr('x', dimensionCtrlWidth / 2)
        .attr('y', dimension.margin.bottom - 10)
        .attr('fill', 'black')
        .text('Humadity')
        .style('font-size', '20px')

    yAxisGroup.append('text')
        .attr('x', -dimensionCtrlHeight / 2)
        .attr('y', -dimension.margin.left + 15)
        .attr('fill', 'black')
        .text('Temprature')
        .style('font-size', '20px')
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle')

    negYaxisGroup.append('text')
        .attr('x', -dimensionCtrlHeight - 350)
        .attr('y', -dimension.margin.left + 15)
        .attr('fill', 'black')
        .text('-ve Temprature')
        .style('font-size', '20px')
        .style('transform', 'rotate(270deg)')
        .style('text-anchor', 'middle')
}


async function drawHistogram(el, scale) {

const histodata = await d3.json('histogram.json')
 histodata.sort((a,b) => a-b)
const histoDimesion = {width:650, height:150}
const box = 30


//  scales
let colorScale

if(scale === 'linear'){
  colorScale = d3.scaleLinear()
                 .domain(d3.extent(histodata))
                 .range(['white', 'green'])
} else if (scale === 'qauntize') {
    colorScale = d3.scaleQuantize()
                   .domain(d3.extent(histodata))
                   .range(['white', 'pink', 'red'])
} else if (scale === 'qauntile') {
    colorScale = d3.scaleQuantile()
                   .domain(histodata)
                   .range(['white', 'pink', 'red'])
}
else if (scale === 'threshold') {
    colorScale = d3.scaleThreshold()
                   .domain([45200, 135600])
                   .range(['white', 'pink', 'red'])
}


const svg = d3.select(el)
              .append('svg')
              .attr('width', histoDimesion.width)
              .attr('height', histoDimesion.height)


    svg.append('g')
       .attr('transform', 'translate(2, 2)')
       .attr('stroke', 'black')
       .selectAll('rect')
       .data(histodata)
       .join('rect')
       .attr('width', box - 3)
       .attr('height', box - 3)
       .attr('x', (d,i) => box * (i % 20)) // 0 30 60
       .attr('y', (d,i) => box * ((i / 20) | 0))
       .attr('fill', colorScale)

}

async function drawBar(el) {

    const bardata = await d3.json('data.json')
  
    const xAxis1 = (d) => d.currently.humidity
    const yAxis1 = (d) => d.length
    let dimension1 = {
        width: 800,
        height: 400,
        margin: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }

    }

    const dimensionCtrlWidth1 = dimension1.width - dimension1.margin.left - dimension1.margin.right
    const dimensionCtrlHeight1 = dimension1.height - dimension1.margin.top - dimension1.margin.bottom
    // const box = 30


    const svg = d3.select(el)
    .append('svg')
    .attr('width', dimension1.width)
    .attr('height', dimension1.height)


    const ctrl1 = svg.append('g')
                     .attr(
                        'transform', `translate(${dimension1.margin.top}, ${dimension1.margin.top})` 

                     )

          //    scales
          const xScale1 = d3.scaleLinear()
          .domain(d3.extent(bardata, xAxis1))
          .range([0, dimensionCtrlWidth1])
          .nice()
  


const bin = d3.bin()
              .domain(xScale1.domain())
              .value(xAxis1)
              .thresholds(10)


const newData = bin(bardata)

console.log(newData)

const yScale1 = d3.scaleLinear()
.domain([0, d3.max(newData, yAxis1)])
.range([dimensionCtrlHeight1, 0])
.nice()





    ctrl1.selectAll('rect')
        .data(newData)
        .join('rect')
        .attr('width', d => d3.max([0, xScale1(d.x1) - xScale1(d.x0) - 1]))
        .attr('height', d => dimensionCtrlHeight1 - yScale1(yAxis1(d)))
        .attr('x', d => xScale1(d.x0))
        .attr('y', d => yScale1(yAxis1(d)))
        .attr('fill', 'blue')
   
        
    // draw axis

const xAxisLine1 = d3.axisBottom(xScale1)

const xAxisGroup1 = ctrl1.append('g')
                         .style('transform', `translateY(${dimensionCtrlHeight1}px)` )

        xAxisGroup1.call(xAxisLine1)                
    }





drawHistogram('#histogram', 'linear')
drawHistogram('#histogram2', 'qauntize')
drawHistogram('#histogram3', 'qauntile')
drawHistogram('#histogram4', 'threshold')
drawBar('#histogram5')
drawGraph()