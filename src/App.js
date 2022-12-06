import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import Header from './Header';
import Sidebar from './Sidebar';

function App() {
	return (
		<div>
		<Header name="Vlinder Software" logoLocation="/logo.png" />
		<div className="container-fluid">
		<div className="row">
		<div className="col-sm-3">
		<Sidebar />
		</div>
		<div className="col-sm-9">
		</div>
		</div>
		</div>
		</div>
	);
}

export default App;
