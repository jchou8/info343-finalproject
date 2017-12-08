import React, { Component } from 'react';
import { Button } from 'reactstrap';

// Header row for the link table
export default class TableHeader extends Component {
    render() {
        let headers = this.props.cols.map((colName, i) => {
            // Set icon to indicate current sort method
            let icon;
            if (colName === this.props.sortCol) {
                if (this.props.sortDir === 'asc') {
                    icon = <i className='fa fa-sort-asc' aria-label='Sorted ascending'></i>;
                } else {
                    icon = <i className='fa fa-sort-desc' aria-label='Sorted descending'></i>;
                }
            } else {
                icon = <i className='fa fa-sort' aria-ignore='true'></i>;
            }

            return (
                <th key={colName}>
                    <Button outline size="sm" color="secondary"
                        onClick={() => { this.props.sortCallback(colName) }}
                        tabIndex={i + 1}
                        style={{
                            "cursor": "pointer",
                        }}>
                        <span style={{ "whiteSpace": "nowrap" }}>
                            {colName}
                            {' '}
                            {icon}
                        </span>
                    </Button>
                </th>
            );
        });

        return (
            <thead>
                <tr>
                    {headers}
                </tr>
            </thead>
        )
    }
}