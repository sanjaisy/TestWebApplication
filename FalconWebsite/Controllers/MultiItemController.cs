using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace FalconWebsite.Controllers
{
    public class MultiItemController : Controller
    {
       
        public IActionResult MultiItems()
        {
            return View();
        }
    }
}