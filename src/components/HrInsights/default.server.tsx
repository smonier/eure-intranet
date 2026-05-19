import { jahiaComponent } from "@jahia/javascript-modules-library";
import data from "../../data/hrMockData.json" assert { type: "json" };
import classes from "./component.module.css";
import type { HrInsightsProps, HrMockData, HrCategory, EmployeeRecord } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";

const hrData = data as HrMockData;

const DEFAULT_TITLE_KEY = "hrInsights.title";
const DEFAULT_TITLE_FALLBACK = "HR Insights";

const CATEGORY_METADATA: Record<
  HrCategory,
  {
    titleKey: string;
    descriptionKey: string;
    badgeKey: string;
    fallbackTitle: string;
    fallbackDescription: string;
    fallbackBadge: string;
  }
> = {
  payslips: {
    titleKey: "hrInsights.category.payslips",
    descriptionKey: "hrInsights.description.payslips",
    badgeKey: "hrInsights.badgeLabel.payslips",
    fallbackTitle: "Payslips Overview",
    fallbackDescription:
      "Aggregated payroll information for the last twelve months across the HR team.",
    fallbackBadge: "Payslips",
  },
  vacations: {
    titleKey: "hrInsights.category.vacations",
    descriptionKey: "hrInsights.description.vacations",
    badgeKey: "hrInsights.badgeLabel.vacations",
    fallbackTitle: "Vacation Balances",
    fallbackDescription: "Real-time snapshot of vacation balances and current year usage.",
    fallbackBadge: "Vacations",
  },
  expenses: {
    titleKey: "hrInsights.category.expenses",
    descriptionKey: "hrInsights.description.expenses",
    badgeKey: "hrInsights.badgeLabel.expenses",
    fallbackTitle: "Monthly Expenses",
    fallbackDescription: "Expense claims grouped by category for the previous month.",
    fallbackBadge: "Expenses",
  },
};

const VACATION_TYPE_KEYS: Record<string, string> = {
  "Paid Leave": "hrInsights.vacationTypes.paidLeave",
  "Unpaid Leave": "hrInsights.vacationTypes.unpaidLeave",
  RTT: "hrInsights.vacationTypes.rtt",
};

const EXPENSE_CATEGORY_KEYS: Record<string, string> = {
  Travel: "hrInsights.expenseCategories.travel",
  Meals: "hrInsights.expenseCategories.meals",
  "Office Supplies": "hrInsights.expenseCategories.officeSupplies",
  Training: "hrInsights.expenseCategories.training",
};

const PAYMENT_METHOD_KEYS: Record<string, string> = {
  "Credit Card": "hrInsights.paymentMethods.creditCard",
  Reimbursement: "hrInsights.paymentMethods.reimbursement",
  Cash: "hrInsights.paymentMethods.cash",
};

const formatCurrency = (value: number, locale: string, currency = "EUR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

const formatDate = (
  value: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "2-digit" },
) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const translateVacationType = (type: string) => {
  const key = VACATION_TYPE_KEYS[type];
  return key ? t(key, { defaultValue: type }) : type;
};

const translateExpenseCategory = (name: string) => {
  const key = EXPENSE_CATEGORY_KEYS[name];
  return key ? t(key, { defaultValue: name }) : name;
};

const translatePaymentMethod = (method: string) => {
  const key = PAYMENT_METHOD_KEYS[method];
  return key ? t(key, { defaultValue: method }) : method;
};

const formatDays = (value: number) => t("hrInsights.metric.days", { count: value });

const renderPayslips = (employees: EmployeeRecord[], locale: string) => {
  const noBonusLabel = t("hrInsights.table.noBonus", "—");

  return (
    <div className={classes.tableWrapper}>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>{t("hrInsights.table.employee", "Employee")}</th>
            <th>{t("hrInsights.table.date", "Date")}</th>
            <th className={classes.numeric}>{t("hrInsights.table.gross", "Gross")}</th>
            <th className={classes.numeric}>{t("hrInsights.table.net", "Net")}</th>
            <th className={classes.numeric}>{t("hrInsights.table.bonuses", "Bonuses")}</th>
            <th className={classes.numeric}>{t("hrInsights.table.deductions", "Deductions")}</th>
            <th>{t("hrInsights.table.currency", "Currency")}</th>
            <th>{t("hrInsights.table.department", "Department")}</th>
          </tr>
        </thead>
        <tbody>
          {employees.flatMap((employee) =>
            employee.payslips.map((slip) => (
              <tr key={`${employee.name}-${slip.date}`}>
                <td>{employee.name}</td>
                <td>{formatDate(slip.date, locale)}</td>
                <td className={classes.numeric}>{formatCurrency(slip.grossSalary, locale)}</td>
                <td className={classes.numeric}>{formatCurrency(slip.netSalary, locale)}</td>
                <td className={classes.numeric}>
                  {typeof slip.bonuses === "number"
                    ? formatCurrency(slip.bonuses, locale)
                    : noBonusLabel}
                </td>
                <td className={classes.numeric}>{formatCurrency(slip.deductions, locale)}</td>
                <td>{slip.currency}</td>
                <td>{employee.department}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
};

const renderVacations = (employees: EmployeeRecord[], locale: string) => (
  <div className={classes.summaryGrid}>
    {employees.map((employee) => {
      const summary = employee.vacations;
      return (
        <article className={classes.card} key={employee.name}>
          <header className={classes.cardHeader}>
            <div>
              <h3 className={classes.cardTitle}>{employee.name}</h3>
              <div className={classes.metricLabel}>{employee.department}</div>
            </div>
            <span className={classes.chip}>{t("hrInsights.badge.snapshot", "Snapshot")}</span>
          </header>

          <div className={classes.metricRow}>
            <div className={classes.metric}>
              <span className={classes.metricLabel}>
                {t("hrInsights.metric.totalAvailable", "Total available")}
              </span>
              <span className={classes.metricValue}>{formatDays(summary.totalDaysAvailable)}</span>
            </div>
            <div className={classes.metric}>
              <span className={classes.metricLabel}>{t("hrInsights.metric.taken", "Taken")}</span>
              <span className={classes.metricValue}>{formatDays(summary.totalDaysTaken)}</span>
            </div>
            <div className={classes.metric}>
              <span className={classes.metricLabel}>
                {t("hrInsights.metric.remaining", "Remaining")}
              </span>
              <span className={classes.metricValue}>{formatDays(summary.remainingDays)}</span>
            </div>
          </div>

          <section className={classes.subSection}>
            <h4 className={classes.subSectionTitle}>{t("hrInsights.leaves", "This year's leaves")}</h4>
            {summary.vacationsTaken.length === 0 ? (
              <p className={classes.emptyState}>{t("hrInsights.empty", "No data available.")}</p>
            ) : (
              <div className={classes.tableWrapper}>
                <table className={classes.table}>
                  <thead>
                    <tr>
                      <th>{t("hrInsights.table.type", "Type")}</th>
                      <th>{t("hrInsights.table.start", "Start")}</th>
                      <th>{t("hrInsights.table.end", "End")}</th>
                      <th className={classes.numeric}>
                        {t("hrInsights.table.duration", "Duration")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.vacationsTaken.map((vacation) => (
                      <tr
                        key={`${employee.name}-${vacation.startDate}-${vacation.endDate}`}
                      >
                        <td>{translateVacationType(vacation.type)}</td>
                        <td>{formatDate(vacation.startDate, locale)}</td>
                        <td>{formatDate(vacation.endDate, locale)}</td>
                        <td className={classes.numeric}>{formatDays(vacation.durationDays)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </article>
      );
    })}
  </div>
);

const renderExpenses = (employees: EmployeeRecord[], locale: string) => (
  <div className={classes.summaryGrid}>
    {employees.map((employee) => {
      const expenses = employee.expenses;
      const monthLabel = formatDate(expenses.month, locale, {
        year: "numeric",
        month: "long",
      });

      return (
        <article className={classes.card} key={employee.name}>
          <header className={classes.cardHeader}>
            <div>
              <h3 className={classes.cardTitle}>{employee.name}</h3>
              <div className={classes.metricLabel}>
                {employee.department} · {monthLabel}
              </div>
            </div>
            <span className={classes.chip}>{formatCurrency(expenses.totalAmount, locale)}</span>
          </header>

          <section className={classes.expenseCategories}>
            {expenses.categories.map((category) => {
              const categoryTotal = category.items.reduce((sum, item) => sum + item.amount, 0);
              const categoryLabel = translateExpenseCategory(category.name);
              return (
                <div key={`${employee.name}-${category.name}`}>
                  <div className={classes.categoryHeader}>
                    <span>{categoryLabel}</span>
                    <span className={classes.categoryTotal}>
                      {formatCurrency(categoryTotal, locale)}
                    </span>
                  </div>
                  <div className={classes.tableWrapper}>
                    <table className={classes.table}>
                      <thead>
                        <tr>
                          <th>{t("hrInsights.table.date", "Date")}</th>
                          <th>{t("hrInsights.table.description", "Description")}</th>
                          <th>{t("hrInsights.table.payment", "Payment")}</th>
                          <th className={classes.numeric}>{t("hrInsights.table.amount", "Amount")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item) => (
                          <tr
                            key={`${employee.name}-${category.name}-${item.date}-${item.description}`}
                          >
                            <td>{formatDate(item.date, locale)}</td>
                            <td>{item.description}</td>
                            <td>{translatePaymentMethod(item.paymentMethod)}</td>
                            <td className={classes.numeric}>{formatCurrency(item.amount, locale)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </section>
        </article>
      );
    })}
  </div>
);

const renderCategory = (category: HrCategory, employees: EmployeeRecord[], locale: string) => {
  switch (category) {
    case "vacations":
      return renderVacations(employees, locale);
    case "expenses":
      return renderExpenses(employees, locale);
    case "payslips":
    default:
      return renderPayslips(employees, locale);
  }
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "euint:hrInsights",
    name: "default",
    displayName: "HR Insights",
  },
  (props: HrInsightsProps, { renderContext }: { renderContext: RenderContext }) => {
    const category = (props["eui:category"] || "payslips") as HrCategory;
    const categoryMeta = CATEGORY_METADATA[category];

    const contextWithLocale = renderContext as unknown as {
      getUILocale?: () => unknown;
      getLocale?: () => unknown;
    };
    const localeCandidate =
      typeof contextWithLocale.getUILocale === "function"
        ? contextWithLocale.getUILocale()
        : typeof contextWithLocale.getLocale === "function"
          ? contextWithLocale.getLocale()
          : null;
    const locale =
      localeCandidate && typeof (localeCandidate as { toString?: () => string }).toString === "function"
        ? (localeCandidate as { toString: () => string }).toString()
        : "en";

    const fallbackTitle = categoryMeta
      ? t(categoryMeta.titleKey, { defaultValue: categoryMeta.fallbackTitle })
      : t(DEFAULT_TITLE_KEY, { defaultValue: DEFAULT_TITLE_FALLBACK });
    const title =
      props["jcr:title"] ||
      fallbackTitle ||
      t(DEFAULT_TITLE_KEY, { defaultValue: DEFAULT_TITLE_FALLBACK });

    const description =
      props["eui:description"] ||
      (categoryMeta
        ? t(categoryMeta.descriptionKey, { defaultValue: categoryMeta.fallbackDescription })
        : "");

    const badgeLabel =
      categoryMeta
        ? t(categoryMeta.badgeKey, { defaultValue: categoryMeta.fallbackBadge })
        : category.toUpperCase();

    const jahiaUser = typeof renderContext.getUser === "function" ? renderContext.getUser() : null;
    const userWithName = jahiaUser as unknown as { getName?: () => string } | null;
    const rawName =
      userWithName && typeof userWithName.getName === "function"
        ? userWithName.getName()
        : undefined;

    const normalizedName = rawName ? rawName.trim().toLowerCase() : undefined;
    const employeesToShow = normalizedName
      ? hrData.employees.filter((employee) => employee.name.toLowerCase() === normalizedName)
      : hrData.employees;

    const formattedToday = new Intl.DateTimeFormat(locale).format(new Date());
    const summaryLabel = t("hrInsights.summary", {
      count: employeesToShow.length,
      date: formattedToday,
      interpolation: { escapeValue: false },
      defaultValue:
        employeesToShow.length === 1
          ? `1 employee · Updated ${formattedToday}`
          : `${employeesToShow.length} employees · Updated ${formattedToday}`,
    });

    return (
      <section className={classes.root}>
        <header className={classes.header}>
          <h2 className={classes.title}>{title}</h2>
          {description && (
            <div
              className={classes.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          <div className={classes.toolbar}>
            <span className={classes.badge}>{badgeLabel}</span>
            <span className={classes.metricLabel}>{summaryLabel}</span>
          </div>
        </header>

        {employeesToShow.length === 0 ? (
          <div className={classes.emptyState}>{t("hrInsights.empty", "No data available.")}</div>
        ) : (
          renderCategory(category, employeesToShow, locale)
        )}
      </section>
    );
  },
);
