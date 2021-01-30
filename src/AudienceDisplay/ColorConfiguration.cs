namespace AudienceDisplay
{
    public class ColorConfigurationOptions
    {
        public ColorConfiguration ColorConfiguration { get; set; }
    }

    public class ColorConfiguration
    {
        public Author Author { get; set; } = new Author();
        public Picture Picture { get; set; } = new Picture();
        public Comment Comment { get; set; } = new Comment();
    }

    public class Author
    {
        public string Background { get; set; } = "#000144";
        public string Border { get; set; } = "#000144";
        public string Text { get; set; } = "#fff";
    }

    public class Picture
    {
        public string Border { get; set; } = "#fff";
    }

    public class Comment
    {
        public string Background { get; set; } = "#000084";
        public string Text { get; set; } = "#fff";
    }
}
