using FalconWebsite.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace FalconWebsite.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("Admin/[controller]/[Action]")]
    public class AdminController : BaseController
    {
        
        private IMemoryCache _memoryCache;

        public AdminController(IMemoryCache memoryCache)
        {
            
            _memoryCache = memoryCache;
        }
        public IActionResult Index()
        {
            return View();
        }

        

    }
}