using AudienceDisplay.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AudienceDisplay
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ColorConfigurationOptions>(Configuration);
            services.AddRazorPages();
            services.AddSignalR();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder//.WithOrigins("https://www.youtube.com")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetIsOriginAllowed((host) => true)
                        .AllowCredentials();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();
            app.UseCors();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapHub<AudienceDisplayListener>("/listen");
            });
        }
    }
}
