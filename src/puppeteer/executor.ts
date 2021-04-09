import * as puppeteer from "puppeteer";
import { ElementHandle, Page } from "puppeteer";

import { Military } from "../prototypes/military";
import { Config } from "../config";
import { insert } from "../data/repository-mongo";

export async function execute (config: typeof Config) {
  const browser = await puppeteer.launch({ headless: config.HEADLESS });

  const page = await browser.newPage();
  await page.goto(config.URL_SITE, { waitUntil: "load" });

  const expressionXPathFilter = "//div[@id=\"id-box-filtro\"]";
  const pathFilter = `${expressionXPathFilter}//div/ul/li`;

  await wait(expressionXPathFilter, page, config);

  const typeServantValueToSelect = "Tipo de servidor";
  await selectFilterTypeServant(typeServantValueToSelect, pathFilter, page, config);

  const typeMilitaryValueToSelect = "Militar";
  await selectFilterTypeMilitary(typeMilitaryValueToSelect, pathFilter, page, config);
  await clickInButtonSearch(page, config);

  const expressionTable = "//div[contains(@class, \"box-tabela-completa\")]//table[@id=\"lista\"]/tbody";
  await selectAirForce(expressionTable, page, config);
  const insertedCount = await getData(expressionTable, page, config);

  await browser.close();

  return insertedCount;
};

async function wait (expression: string, page: Page, config: typeof Config) {
  await page.waitForTimeout(config.TIME_WAIT_DEFAULT);
  if (expression.startsWith("//")) {
    await page.waitForXPath(expression, { visible: true });
  } else {
    await page.waitForSelector(expression, { visible: true });
  }
}

async function selectFilterTypeServant (filterValue: string, pathFilter: string, page: Page, config: typeof Config) {
  const expressionTypeServant = `${pathFilter}/div/button[text()="${filterValue}"]`;
  await wait(expressionTypeServant, page, config);
  const filterButton = await getElementByExpression(expressionTypeServant, page);
  await filterButton[0].click();
}

async function selectFilterTypeMilitary (typeServant: string, pathFilter: string, page: Page, config: typeof Config) {
  const expressionFilterTypeServant = `//div[@data-gaveta-of="tipo"]/div[@class="btn-group"]//a/label[text()=" ${typeServant}"]/input[@type="checkbox"]`;
  await wait(expressionFilterTypeServant, page, config);

  const typeServantCheckbox = await getElementByExpression(expressionFilterTypeServant, page);
  await typeServantCheckbox[0].click();

  const selectorButtonAdd = `${pathFilter}//div[@class="btn-group"]//input[@type="button"]`;
  await wait(selectorButtonAdd, page, config);
  const buttonAddFilter = await getElementByExpression(selectorButtonAdd, page);
  await buttonAddFilter[0].click();
}

async function clickInButtonSearch (page: Page, config: typeof Config) {
  const expressionButtonSearch = "//section[@class=\"box-detalhamento--tipo-b\"]//button[contains(@class, \"btn-consultar\")]";
  await wait(expressionButtonSearch, page, config);

  const buttonSearch = await getElementByExpression(expressionButtonSearch, page);
  await buttonSearch[0].click();
}

async function selectAirForce (expressionTable: string, page: Page, config: typeof Config) {
  const linkDetailText = "Comando da Aeronáutica";
  const expressionButtonDatail = `${expressionTable}//td/span[text()="${linkDetailText}"]/../..//a`;

  await wait(expressionButtonDatail, page, config);
  const buttonDetail = await getElementByExpression(`${expressionButtonDatail}`, page);
  await buttonDetail[0].click();

  await wait(expressionTable, page, config);
}

async function getData (expressionTable: string, page: Page, config: typeof Config) {
  const selectorButtonNext = ".box-paginacao #lista_next";
  await wait(selectorButtonNext, page, config);

  let buttonNextIsDisable = false;
  let insertedCount = 0;

  do {
    try {
      buttonNextIsDisable = await page.$eval(selectorButtonNext, el => {
        const buttonNext = el.getAttribute("class");
        return buttonNext ? buttonNext.includes("disabled") : true;
      });

      const items = await getItemsTable(expressionTable, page);
      insertedCount += await insert(items);
      console.log(`==== PARCIAL INSERTED ${insertedCount}====`);

      await page.click(selectorButtonNext);
    } catch (error) {
      console.error(`==== ERROR ${error.stack}====`);
      throw error;
    }
  } while (!buttonNextIsDisable);

  return insertedCount;
}

async function getItemsTable (expressionTable: string, page) {
  const table: ElementHandle[] = await getElementByExpression(`${expressionTable}/tr`, page);

  const items: Military[] = [];

  for (const item of table) {
    const values = await item.$$("td");
    const type = await values[1].$eval("span", el => el.textContent);
    const cpf = await values[2].$eval("span", el => el.textContent);
    const name = await values[3].$eval("span", el => el.textContent);
    const registrationNumber = await values[6].$eval("span", el => el.textContent);

    items.push({ type, cpf, name, registrationNumber });
  }

  return items;
}

async function getElementByExpression (expression, page) {
  try {
    const typeFlter = await page.$x(expression);
    return typeFlter;
  } catch (error) {
    throw new Error(`Expression ${expression} not found elements.`);
  }
}
