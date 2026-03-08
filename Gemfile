source 'https://rubygems.org'

# GitHub Pages gem includes Jekyll and plugins compatible with GitHub Pages
gem 'github-pages', group: :jekyll_plugins

# Markdown parser
gem "kramdown", ">= 2.3.1"

# Additional plugins
gem "jekyll-gist"

# Explicit stdlib gems to avoid Ruby 3.4 default-gem deprecation warnings
gem "csv"
gem "base64"
gem "bigdecimal"

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1.2.0"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", ">= 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
