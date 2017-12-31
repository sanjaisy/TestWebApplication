using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

namespace FalconWebsite.Controllers
{
    public class AccountController : BaseController
    {
        
        private IMemoryCache _memoryCache;

        public AccountController(IMemoryCache memoryCache)
        {
            
            _memoryCache = memoryCache;
        }
        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }
        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        

        
    }
}