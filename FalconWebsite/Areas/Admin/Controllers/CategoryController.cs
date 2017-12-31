using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using FalconWebsite.Controllers;
using Microsoft.AspNetCore.Hosting;

namespace FalconWebsite.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("Admin/[controller]/[Action]")]
    public class CategoryController : BaseController
    {
        private readonly IHostingEnvironment _environment;
        
        private readonly IMemoryCache _memoryCache;

        public CategoryController(IMemoryCache memoryCache, IHostingEnvironment environment)
        {
            _memoryCache = memoryCache;
            _environment = environment;
        }
        public IActionResult Category()
        {
            return View();
        }

       
    }
}