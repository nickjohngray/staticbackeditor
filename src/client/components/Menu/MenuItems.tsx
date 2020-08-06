import {Link} from '@reach/router';
import React, {FC} from 'react';
import {connect} from 'react-redux';
import {IManifest, IPage, IState} from '../../typings';

interface MenuItemProps {
    URL: string;
    cartCount: number;
}

const MenuItems: FC<MenuItemProps> = ({URL, cartCount}) => {
    const pages = [
        { "name": "home", "path": "/" },
        { "name": "error", "path": "404"},
        { "name": "pages", "path": "pages" },
        { "name": "products", "path": "products"},
        ]

    return (
        <>
            {pages.map((page: IPage, key: number) => {
                let makeLink = true;

                if (page.path === '404') {
                    makeLink = false;
                }

                return (
                    makeLink && (
                        <Link key={key} className={page.path === fixURL(URL) ? 'active' : null} to={page.path}>
                            {page.name}
                        </Link>
                    )
                );
            })}
        </>
    );
};

const fixURL = (url: string) => {
    if (url !== '/') {
        return url.substring(1);
    } else {
        return url;
    }
};

export default connect((state: IState) => ({
    URL: state.history.URL,
}))(MenuItems);
