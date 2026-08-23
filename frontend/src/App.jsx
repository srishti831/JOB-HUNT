
import { Button } from "@/components/ui/button"
import {Navbar } from "@/components/ui/shared/navbar.jsx";
import { createBrowserRouter } from "react-router-dom";

const appRouter = createBrowserRouter({
  {
    path : '/',
    element: <Home/>
  },
   {
    path : '/login',
    element: <Login/>
  },
   {
    path : '/signup',
    element: <Signup/>
  },
   {
    path : '/',
    element: <Home/>
  }, {
    path : '/',
    element: <Home/>
  },
   {
    path : '/',
    element: <Home/>
  },
});
 

function App() {
  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-4xl font-bold">Lets build Job-Hunt</h1>

        <Button className="mt-4">Get Started</Button>
      </div>
    </>
  )
}

export default App