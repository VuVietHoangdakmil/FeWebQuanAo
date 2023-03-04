import {BrowserRouter,Routes,Route} from"react-router-dom";
import DefaultLayout from "./components/layout/defaultlayout";
import {publicRouters} from './routers'
function App() {
  
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          {publicRouters.map((router, index) => {
            const { path, Page } = router;
            return <Route key={index} path={path} element={<Page />} />;
          })}
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
