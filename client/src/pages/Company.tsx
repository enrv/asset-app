import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useLang } from "../hooks/useLang"
import * as d3 from "d3"

function Companies() {
    const { getMessages } = useLang()

    let params = useParams()

    const [history, failedStatus] = getCompanyHistory(params.code)

    useEffect(() => {
        document.title += " | " + getMessages().company.pageTitle.replace("$company", params.code)
    }, [])

    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 640 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom

    const svg = d3.select(".svg-chart")
    .append("svg")
        .attr("width", 640)
        .attr("height", 400)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    const priceHistory = []
    for (const [date, price] of Object.entries(history)) {
        priceHistory.push({date: d3.timeParse("%Y-%m-%d")(date), value: price})
    }

    const x = d3.scaleTime()
        .domain(d3.extent(priceHistory, function(d) { return d.date; }))
        .range([ 0, width ])

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([0, d3.max(priceHistory, function(d) { return +d.value; })])
        .range([ height, 0 ])

    svg.append("g")
        .call(d3.axisLeft(y))

    svg.append("path")
        .datum(priceHistory)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) })
        )

    if (failedStatus == true) {
        return <Navigate to="/404" />
    }

    return (
        <div>
            <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">{getMessages().company.pageTitle.replace("$company", params.code)}</h2>
            <svg className="svg-chart" width="640px" height="400px"></svg>
        </div>
    )
}

function getCompanyHistory(code: string) {
    const [ companyHistory, setCompanyHistory ] = useState([])
    const [ companyHistoryFailed, setCompanyHistoryFailed ] = useState(false)

    useEffect(() => {
        fetch("/api/get-company-history?name=" + code)
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                }
                setCompanyHistoryFailed(true)
                throw new Error("Error fetching company history")
            })
            .then(data => setCompanyHistory(data.prices))
            .catch(e => console.log(e))
    }, [])

    return [companyHistory, companyHistoryFailed]
}

export default Companies