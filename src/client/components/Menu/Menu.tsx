import {faBars, faDumbbell} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {FC, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {IState} from '../../typings';
import MenuItems from './MenuItems';

const Menu: FC = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        setMenuOpen(false);
    }, []);

    return (
        <div
            tabIndex={0}
            onBlur={() => {
                setMenuOpen(false);
            }}
        >
            <button
                id="trigger-mobile"
                onClick={() => setMenuOpen(!isMenuOpen)}
                className={isMenuOpen ? 'trigger-mobile-menu-open' : 'trigger-mobile-menu-closed'}
            >
                <FontAwesomeIcon size="2x" icon={isMenuOpen ? faDumbbell : faBars} />
            </button>
            <div
                onClick={() => setMenuOpen(false)}
                id="menu"
                className={isMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}
            >
                <MenuItems></MenuItems>
            </div>
        </div>
    );
};

export default connect((state: IState) => ({
    URL: state.history.URL,
}))(Menu);
