import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
import pandas_datareader.data as web
import yfinance as yf
from datetime import datetime
from typing import List, Dict, Optional

def fetch_companies() -> List[Dict[str, str]]:
    url = "https://sistemaswebb3-listados.b3.com.br/indexPage/day/IBOV?language=pt-br"

    driver = webdriver.Chrome()
    driver.implicitly_wait(30)
    driver.get(url)

    pages = []
    while True:
        tab = driver.find_element(By.CLASS_NAME, "table-responsive-sm")
        tab_html = tab.get_attribute("outerHTML")
        tab_df = pd.read_html(tab_html, decimal=',', thousands='.')
        pages.append(tab_df[0])

        next_page = driver.find_element(By.CLASS_NAME, "pagination-next")
        check = next_page.get_attribute("outerHTML")
        if check is None or "disabled" in check:
            break # last page

        next_page.click()

    codes = [code for page in pages for code in page["Código"] if code not in ["Quantidade Teórica Total", "Redutor"]]
    names = [name for page in pages for name in page["Ação"] if name not in ["Quantidade Teórica Total", "Redutor"]]

    companies = [{"code": code + ".SA", "name": name} for code, name in zip(codes, names)]

    return companies

def get_historical_prices(company_code: str, from_date: Optional[datetime] = None) -> pd.Series:
    yf.pdr_override() # avoid TypeError: string indices must be integers
    return web.get_data_yahoo(company_code, start=from_date)["Adj Close"]

if __name__ == "__main__":
    companies = fetch_companies()
    for company in companies:
        company["prices"] = get_historical_prices(company["code"])
    print(companies)