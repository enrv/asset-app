import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Companies() {
    let params = useParams()

    useEffect(() => {
        if (params.code) {
            document.title += " | Company " + params.code
        } else {
            document.title += " | Companies"
        }
    }, [])

    if (params.code) {
        const listOfPrices = []
        for (const [date, price] of Object.entries(getCompanyHistory(params.code))) {
            listOfPrices.push(<li>{date}: {price}</li>)
        }
        return (
            <div>
                <h2>Company {params.code}</h2>
                <ul>{listOfPrices}</ul>
            </div>
        )
    } else {
        const listOfCompanies = []
        getCompanies().forEach(company => {
            const link = "/companies/" + company.asset_code
            listOfCompanies.push(<li><a href={link}>{company.asset_code}</a>: {company.asset_name}</li>)
        })
        return (
            <div>
                <h2>Companies</h2>
                <ul>{listOfCompanies}</ul>
            </div>
        )
    }
}

function getCompanies() {
    const [ companies, setCompanies ] = useState([])

    useEffect(() => {
        fetch("/api/get-all-companies")
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                }
                throw new Error("Error fetching companies")
            })
            .then(data => setCompanies(data.companies))
            .catch(error => console.error(error))
    }, [])

    return companies
}

function getCompanyHistory(code: string) {
    const [ companyHistory, setCompanyHistory ] = useState([])

    useEffect(() => {
        fetch("/api/get-company-history?name=" + code)
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                }
                throw new Error("Error fetching company history")
            })
            .then(data => setCompanyHistory(data.prices))
            .catch(error => console.error(error))
    }, [])

    return companyHistory
}

export default Companies