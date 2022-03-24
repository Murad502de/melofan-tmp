import React, {Component} from "react";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";

class DrawerItem extends Component {
	render() {
		const {text, to, icon: Icon} = this.props;

		return (
			<ListItem button component={Link} to={to}>
				<ListItemIcon>
					<Icon />
				</ListItemIcon>
				<ListItemText primary={text} />
			</ListItem>
		);
	}
}

export default DrawerItem;
