import React from 'react'

import { FormControl, InputLabel, Select, MenuItem as Option } from "@material-ui/core"

function Dropdown({ title, selected, list, ...props }) {
    return (
        <FormControl >
            <InputLabel className="app__label">{title}</InputLabel>
            <Select
                value={selected}
                onChange={props.onChange}>
                {list.map(listItem =>
                    <Option
                        key={listItem.key}
                        value={listItem.key}>
                        {listItem.value}
                    </Option>
                )}
            </Select>
        </FormControl>
    )
}

export default Dropdown
