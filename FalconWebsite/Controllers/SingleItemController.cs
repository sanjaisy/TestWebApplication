using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace FalconWebsite.Controllers
{
    public class SingleItemController : Controller
    {
        public IActionResult SingleItem()
        {
            return View();
        }
    }
}