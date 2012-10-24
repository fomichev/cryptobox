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
      @config = { ui: {}, cryptobox: {}, chrome: {}, path: {}, text: {} }

      user_config = path ? YAML.load_file(path).symbolize_keys : {}

      set_value user_config, :ui, :jquery_ui_theme, 'flick'
      set_value user_config, :ui, :default_password_length, 16
      set_value user_config, :ui, :lock_timeout_minutes, 5

      if RUBY_PLATFORM =~ /(win|w)32$/
        set_value user_config, :ui, :editor, 'gvim -n -f'
        set_value user_config, :path, :home, "#{ENV['HOMEDRIVE']}#{ENV['HOMEPATH']}"
      # else if on mac => use mvim
      else
        set_value user_config, :ui, :editor, 'vim -n -f'
        set_value user_config, :path, :home, Dir.home
      end


#      set_value user_config, :ui, :editor, 'mvim -n -f'
#      set_value user_config, :ui, :editor, 'gvim -n -f'
#editor=ENV['EDITOR']
#editor='gvim -n -f'
#editor='mvim -n -f'
#editor='vim -n'
      set_value user_config, :ui, :lang, :en
#      set_value user_config, :ui, :lang, :ru

      set_value user_config, :cryptobox, :version, VERSION
      set_value user_config, :cryptobox, :date_format, '%H:%M %d.%m.%Y'
      set_value user_config, :cryptobox, :date, DateTime.now.strftime(@config[:cryptobox][:date_format])
      set_value user_config, :cryptobox, :keep_backups, true

      set_value user_config, :path, :root, Dir.pwd

      set_value user_config, :path, :build, File.expand_path(File.join(@config[:path][:root], 'build'))
      set_value user_config, :path, :private, File.expand_path(File.join(@config[:path][:root], 'private'))
      set_value user_config, :path, :include, File.expand_path(File.join(@config[:path][:root], 'include'))
      set_value user_config, :path, :templates, File.expand_path(File.join(@config[:path][:root], 'templates'))

      set_value user_config, :path, :cryptobox, File.expand_path(File.join(@config[:path][:private], 'cryptobox'))
      set_value user_config, :path, :backup, File.expand_path(File.join(@config[:path][:private], 'backup'))
    end
  end
end
