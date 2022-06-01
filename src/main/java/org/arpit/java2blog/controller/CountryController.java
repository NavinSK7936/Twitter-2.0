package org.arpit.java2blog.controller;

import java.util.List;



import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.arpit.java2blog.bean.Country;
import org.arpit.java2blog.service.CountryService;
import org.arpit.java2blog.bean.TwitterUser;

@Path("countries")
public class CountryController {
	
	CountryService countryService = new CountryService();
	
//	CountryServiceMySql countryService = new CountryServiceMySql();
	
	@GET
	@Path("x")
	@Produces(MediaType.APPLICATION_JSON)
	public TwitterUser getUser() {
		
		return new TwitterUser();
		
	}
	
    @GET
//    @Produces("text/html")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public List<Country> getCountries()
	{
		
		List<Country> listOfCountries=countryService.getAllCountries();
		return listOfCountries;
	}

    @GET
    @Path("/{id}")
//    @Produces("text/html")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Country getCountryById(@PathParam("id") int id)
	{
		return countryService.getCountry(id);
	}
   
    @POST
//    @Produces("text/html")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Country addCountry(Country country)
	{
		return countryService.addCountry(country);
	}

    @PUT
//    @Produces("text/html")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public Country updateCountry(Country country)
	{
		return countryService.updateCountry(country);
		
	}
	
    @DELETE
    @Path("/{id}")
//    @Produces("text/html")
    @Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	public void deleteCountry(@PathParam("id") int id)
	{
		 countryService.deleteCountry(id);
		
	}
	
}
