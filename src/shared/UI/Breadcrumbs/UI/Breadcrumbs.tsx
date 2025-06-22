import React from "react";
import { useLocation, Link } from "react-router-dom";
import classes from "./Breadcrumbs.module.scss";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation();

  if (items) {
    return (
      <div className={classes.breadcrumbs}>
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            {index === 0 ? (
              <Link to={item.href} className={classes.crumb}>
                {item.title}
              </Link>
            ) : (
              <Link to={item.href} className={classes.crumb}>
                {item.title}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  
  let currentLink = "";
  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `/${crumb}`;
      return (
        <Link to={currentLink} className={classes.crumb} key={crumb}>
          {crumb}
        </Link>
      );
    });
  
  return (
    <div className={classes.breadcrumbs}>
      <Link to="/" className={classes.crumb}>главная</Link>
      {crumbs}
    </div>
  );
};
