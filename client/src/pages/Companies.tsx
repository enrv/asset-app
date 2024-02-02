import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
                <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Company {params.code}</h2>
                <ul>{listOfPrices}</ul>
            </div>
        )
    } else {
        const listOfCompanies = []
        let i = 1
        getCompanies().forEach(company => {
            const link = "/companies/" + company.asset_code
            listOfCompanies.push(
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>{company.asset_code}</CardTitle>
                        <CardDescription>{company.asset_name}</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button>
                            <a href={link}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            )
        })
        return (
            <div>
                <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Companies</h2>
                <div className="grid grid-cols-8 gap-10">{listOfCompanies}</div>
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