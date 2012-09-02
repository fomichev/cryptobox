#require 'pp'
require 'date'

module Cryptobox
  class Config
    def initialize(path)
      paths = path ? [ path ] : [ '.cryptoboxrc.yml', File.join(ENV['HOME'], '.cryptoboxrc.yml') ]
      paths = paths.select {|f| File.exist? f }

      load_config(paths.first)
    end

    def set_value(user_config, group, variable, default='')
      if user_config.has_key? group and user_config[group].has_key? variable
        @config[group][variable] = user_config[group][variable]
      else
        @config[group][variable] = default
      end
    end

    def [](var)
      return @config[var]
    end

    def load_config(path)
      @config = { ui: {}, cryptobox: {}, path: {}, text: {} }

      user_config = path ? YAML.load_file(path).symbolize_keys : {}

      set_value user_config, :ui, :jquery_ui_theme, 'flick'
      set_value user_config, :ui, :default_password_length, 16
      set_value user_config, :ui, :lock_timeout_minutes, 5


      set_value user_config, :ui, :editor, 'vim -n -f'
#      set_value user_config, :ui, :editor, 'mvim -n -f'
#      set_value user_config, :ui, :editor, 'gvim -n -f'
#editor=ENV['EDITOR']
#editor='gvim -n -f'
#editor='mvim -n -f'
#editor='vim -n'
#      set_value user_config, :ui, :lang, :en
      set_value user_config, :ui, :lang, :ru

      set_value user_config, :cryptobox, :version, VERSION
      set_value user_config, :cryptobox, :date_format, '%H:%M %d.%m.%Y'
      set_value user_config, :cryptobox, :date, DateTime.now.strftime(@config[:cryptobox][:date_format])

      set_value user_config, :path, :root, Dir.pwd

      set_value user_config, :path, :db, File.expand_path(File.join(@config[:path][:root], 'private'))
      set_value user_config, :path, :db_cipher, File.expand_path(File.join(@config[:path][:db], 'cryptobox'))
      set_value user_config, :path, :db_json, File.expand_path(@config[:path][:db_cipher] + '.json')
      set_value user_config, :path, :db_html, File.expand_path(File.join(@config[:path][:db], 'html/cryptobox.html'))
      set_value user_config, :path, :db_clippy, File.expand_path(File.join(@config[:path][:db], 'html/clippy.swf'))
      set_value user_config, :path, :db_mobile_html, File.expand_path(File.join(@config[:path][:db], 'html/m.cryptobox.html'))
      set_value user_config, :path, :db_chrome, File.expand_path(File.join(@config[:path][:db], 'chrome'))
      set_value user_config, :path, :db_chrome_cfg, File.expand_path(File.join(@config[:path][:db], 'chrome/cfg.js'))
      set_value user_config, :path, :db_include, File.expand_path(File.join(@config[:path][:db], 'include'))
      set_value user_config, :path, :db_backup, File.expand_path(File.join(@config[:path][:db], 'backup'))
      set_value user_config, :path, :db_bookmarklet_form, File.expand_path(File.join(@config[:path][:db], 'bookmarket/form.js'))
      set_value user_config, :path, :db_bookmarklet_fill, File.expand_path(File.join(@config[:path][:db], 'bookmarket/fill.js'))
      set_value user_config, :path, :tmp, File.expand_path(File.join(@config[:path][:db], 'tmp'))

      set_value user_config, :path, :include, File.expand_path(File.join(@config[:path][:root], 'include'))
      set_value user_config, :path, :templates, File.expand_path(File.join(@config[:path][:root], 'templates'))
      set_value user_config, :path, :html, File.expand_path(File.join(@config[:path][:templates], 'html'))
      set_value user_config, :path, :bookmarklet, File.expand_path(File.join(@config[:path][:templates], 'bookmarklet'))
      set_value user_config, :path, :chrome, File.expand_path(File.join(@config[:path][:templates], 'chrome'))
      set_value user_config, :path, :clippy, File.expand_path(File.join(@config[:path][:html], '/extern/clippy/build/clippy.swf'))

      set_value user_config, :path, :jquery_ui_css_images, File.expand_path(File.join(@config[:path][:html], '/extern/jquery-ui/css/', @config[:ui][:jquery_ui_theme]))
      set_value user_config, :path, :jquery_mobile_css_images, File.expand_path(File.join(@config[:path][:html], '/extern/jquery-mobile/'))

      # todo: add text (lang)
    end
  end
end
