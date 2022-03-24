import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import {setError} from "../../actions/notification";
import {store} from "../../store/configureStore";
import {useSelector} from "react-redux";

export default function (props) {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(true);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	useEffect(() => {
		getDataOptions();
	}, [inputValue]);

	useEffect(() => {
		if (props.update) {
			setInputValue("");
			getDataOptions();
			props.setUpdate(false);
		}
	}, [props.update]);

	const getDataOptions = () => {
		setLoading(true);
		postRequest(props.urlApi, {...props.additionalFilter, value: inputValue})
			.then(res => {
				setOptions(res.options);
				setLoading(false);
			})
			.catch(err => {
				store.dispatch(setError(languageText[props.urlApi + "Error"]));
			});
	};

	return (
		<Autocomplete
			id="asynchronous-demo"
			className="datapicker select-search"
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			getOptionSelected={(option, value) => option.value === value.value}
			getOptionLabel={option => option.name}
			inputValue={inputValue}
			onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
			options={options}
			loading={loading}
			clearText={languageText["selectSearch1"]}
			closeText={languageText["selectSearch2"]}
			loadingText={languageText["selectSearch3"]}
			noOptionsText={languageText["selectSearch4"]}
			openText={languageText["selectSearch5"]}
			value={props.value}
			onChange={(event, newValue) => props.onChange(newValue)}
			renderInput={params => (
				<TextField
					{...params}
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<React.Fragment>
								{loading && <CircularProgress color="inherit" size={20} />}
								{params.InputProps.endAdornment}
							</React.Fragment>
						),
					}}
				/>
			)}
		/>
	);
}
